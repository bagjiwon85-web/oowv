// SRT -> captions.js (strips chapter '*' markers, fixes typos)
import fs from 'fs';
const src = fs.readFileSync(new URL('./assets/BPT27.srt', import.meta.url), 'utf8').replace(/\r/g, '');
const ts = s => { const [h, m, r] = s.split(':'); const [sec, ms] = r.split(','); return +h * 3600 + +m * 60 + +sec + +ms / 1000; };
const caps = src.trim().split(/\n\n+/).map(b => {
  const l = b.split('\n'); const [a, z] = l[1].split(' --> ');
  let text = l.slice(2).join(' ').trim().replace(/^\*/, '').replace('만들찌', '만들지').replace(/\s*—\s*/, ', ').replace(/^첫 번째 /, '첫 번째, ');
  return { s: ts(a), e: ts(z), text };
});
fs.writeFileSync(new URL('./captions.js', import.meta.url), 'window.CAPS = ' + JSON.stringify(caps, null, 0) + ';\n');
console.log(caps.length, caps[19], caps[52], caps.at(-1));
