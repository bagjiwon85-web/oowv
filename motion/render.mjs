// Usage: node render.mjs <startFrame> <endFrame(excl)> <out.mp4>   |  node render.mjs --stills t1,t2,... <dir>
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
let chromium; try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
import { spawn } from 'child_process';
import path from 'path';
const FPS = 30;
const page_url = 'file://' + path.resolve(path.dirname(new URL(import.meta.url).pathname), 'index.html');
const browser = await chromium.launch({ args: ['--font-render-hinting=none'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
page.on('console', m => { if (m.type() === 'warning' || m.type() === 'error') console.error('[page]', m.text()); });
page.on('pageerror', e => console.error('[pageerror]', e.message));
await page.goto(page_url); await page.evaluate(() => window.ready);
const grab = async t => { await page.evaluate(t => render(t), t); return page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 1920, height: 1080 } }); };
if (process.argv[2] === '--stills') {
  const fs = await import('fs'); const dir = process.argv[4]; fs.mkdirSync(dir, { recursive: true });
  for (const t of process.argv[3].split(',').map(Number)) fs.writeFileSync(`${dir}/s_${t.toFixed(2).padStart(7, '0')}.png`, await grab(t));
} else {
  const [a, b, out] = [+process.argv[2], +process.argv[3], process.argv[4]];
  const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-pix_fmt', 'yuv420p', '-r', String(FPS), out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let f = a; f < b; f++) {
    const buf = await grab(f / FPS);
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if ((f - a) % 300 === 0) console.log(`${out}: ${f - a}/${b - a} ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
}
await browser.close();
