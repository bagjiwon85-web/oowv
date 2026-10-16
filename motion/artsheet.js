const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1600, height: 1400 } });
  p.on('pageerror', e => console.log('ERR', e.message));
  const root = __dirname + '/node_modules/pretendard/dist/public/static/';
  await p.setContent(`<html><head><style>@font-face{font-family:P;font-weight:800;src:url(file://${root}Pretendard-ExtraBold.otf)}@font-face{font-family:P;font-weight:400;src:url(file://${root}Pretendard-Regular.otf)}
  body{margin:0;background:#fff;font-family:P;display:flex;flex-wrap:wrap;gap:10px;padding:10px} .c{width:150px;text-align:center;font-size:14px}</style></head><body></body></html>`);
  await p.addScriptTag({ path: __dirname + '/build/art.js' });
  await p.evaluate(() => {
    const add = (h, n) => { const d = document.createElement('div'); d.className = 'c'; d.innerHTML = h + '<div>' + n + '</div>'; document.body.appendChild(d); };
    for (const n of Object.keys(ICON)) add(iconSVG(n, 140), n);
    for (const o of Object.keys(OUTFITS)) add(svg(140, 160, '0 0 200 230', personInner({ outfit: o, hair: ['short', 'beard', 'quiff', 'bun', 'long', 'chef'][Object.keys(OUTFITS).indexOf(o) % 6] })), o);
    add(badgeSVG({ outfit: 'yellow', hair: 'beard' }, '#F45D6B', 140), 'badge1'); add(badgeSVG({ outfit: 'purple', hair: 'quiff' }, '#FFC845', 140), 'badge2'); add(badgeSVG({ outfit: 'jacket', hair: 'short' }, '#A5D46A', 140), 'badge3');
  });
  await p.waitForTimeout(300);
  await p.screenshot({ path: __dirname + '/artsheet.png', fullPage: true });
  await b.close();
})();
