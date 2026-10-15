// Usage: node render.mjs [--preview t1,t2,...] | [--from s --to s]
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const FPS = 30, WORKERS = 4;
const here = path.dirname(new URL(import.meta.url).pathname);
const out = path.join(here, 'build'); mkdirSync(out, { recursive: true });
const args = process.argv.slice(2);
const opt = k => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };

const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
async function newPage() {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('pageerror', e => { console.error('PAGE ERROR', e.message); process.exit(1); });
  await page.goto('file://' + path.join(here, 'index.html'));
  await page.evaluate(() => window.ready);
  return page;
}
const grab = (page, t, type = 'image/jpeg') => page.evaluate(([t, type]) => { render(t); return document.getElementById('c').toDataURL(type, 0.95); }, [t, type])
  .then(u => Buffer.from(u.split(',')[1], 'base64'));

if (opt('--preview')) {
  const page = await newPage();
  for (const t of opt('--preview').split(',').map(Number)) {
    writeFileSync(path.join(out, 'prev', `p_${t.toFixed(2)}.jpg`), await grab(page, t));
  }
  await browser.close(); process.exit(0);
}

const from = Number(opt('--from') ?? 0), to = Number(opt('--to') ?? 320.6);
const total = Math.ceil((to - from) * FPS);
const per = Math.ceil(total / WORKERS);
const t0 = Date.now();
await Promise.all([...Array(WORKERS).keys()].map(async w => {
  const page = await newPage();
  const a = w * per, b = Math.min(total, a + per);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', '-r', String(FPS), path.join(out, `seg${w}.mp4`)], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let f = a; f < b; f++) {
    const buf = await grab(page, from + f / FPS);
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (w === 0 && f % 300 === 0) console.log(`frame ${f}/${per}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
}));
writeFileSync(path.join(out, 'list.txt'), [...Array(WORKERS).keys()].map(w => `file 'seg${w}.mp4'`).join('\n'));
await browser.close();
console.log('done', ((Date.now() - t0) / 1000).toFixed(0) + 's');
