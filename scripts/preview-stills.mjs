// Renders one still per scene (just before it fades out) for quick visual review.
// Usage: node scripts/preview-stills.mjs <outDir> [browserExecutable] [offsetSec]
import path from 'node:path';
import fs from 'node:fs';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';

const [outDir, browserExecutable, offsetArg] = process.argv.slice(2);
const offset = Number(offsetArg ?? -0.45);
fs.mkdirSync(outDir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id: 'Main', browserExecutable});
const srt = fs.readFileSync('src/scenes.tsx', 'utf8');
const starts = [...srt.matchAll(/^S\(([\d.]+),/gm)].map((m) => Number(m[1]));
const end = composition.durationInFrames / composition.fps;
for (let i = 0; i < starts.length; i++) {
  const next = i + 1 < starts.length ? starts[i + 1] : end;
  const t = offset < 0 ? next + offset : starts[i] + offset;
  const frame = Math.min(composition.durationInFrames - 1, Math.round(t * composition.fps));
  await renderStill({
    composition,
    serveUrl,
    frame,
    output: path.join(outDir, `s${String(i + 1).padStart(3, '0')}.png`),
    scale: 0.5,
    browserExecutable,
  });
  process.stdout.write(`${i + 1} `);
}
console.log('\ndone');
