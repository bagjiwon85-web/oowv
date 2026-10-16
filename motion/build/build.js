const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..', 'node_modules');
const iconDir = path.join(root, '@tabler/icons/icons');
const src = fs.readFileSync(__dirname + '/scenes.js', 'utf8') + fs.readFileSync(__dirname + '/engine.js', 'utf8');
const names = new Set([...src.matchAll(/'([a-z0-9]+(?:-[a-z0-9]+)*)'/g)].map(m => m[1]));
const icons = {};
for (const n of names) for (const [k, d] of [['O', 'outline'], ['F', 'filled']]) {
  const f = path.join(iconDir, d, n + '.svg');
  if (fs.existsSync(f)) icons[k + ':' + n] = fs.readFileSync(f, 'utf8').replace(/<!--[\s\S]*?-->/g, '').replace(/\s*\n\s*/g, ' ').trim();
}
const lines = fs.readFileSync(__dirname + '/lines.json', 'utf8');
const font = w => `@font-face{font-family:P;font-weight:${w[0]};src:url(file://${root}/pretendard/dist/public/static/Pretendard-${w[1]}.otf)}`;
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
${[[400, 'Regular'], [500, 'Medium'], [600, 'SemiBold'], [700, 'Bold'], [800, 'ExtraBold']].map(font).join('\n')}
html,body{margin:0;background:#fff;font-family:P,sans-serif}
#stage{position:relative;width:1920px;height:1080px;overflow:hidden;background:#fff}
.el{position:absolute;transform-origin:center;will-change:transform,opacity}
#sub{position:absolute;left:50%;top:992px;transform:translate(-50%,-50%);z-index:100;display:none}
#sub span{display:block;background:#1E1E1E;color:#fff;font-size:44px;font-weight:500;padding:14px 32px 16px;border-radius:12px;white-space:nowrap;letter-spacing:-0.01em}
</style></head><body><div id="stage"><div id="sub"><span></span></div></div>
<script>const LINES=${lines};const ICONS=${JSON.stringify(icons)};</script>
<script src="engine.js"></script><script src="scenes.js"></script>
<script>buildScenes();finalize(385.3);document.fonts.ready.then(()=>{window.READY=true;});</script>
</body></html>`;
fs.writeFileSync(__dirname + '/index.html', html);
console.log('icons', Object.keys(icons).length);
