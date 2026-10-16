const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('file://' + __dirname + '/build/index.html');
  await p.waitForFunction('window.READY===true', null, { timeout: 15000 }).catch(() => {});
  if (errs.length) { console.log(errs.join('\n')); }
  const mode = process.argv[2];
  let times;
  if (mode === 'scenes') times = await p.evaluate(() => SCENES.map((s, k) => { const e = k + 1 < SCENES.length ? SCENES[k + 1].t : 385.3; return e - 0.4; }));
  else times = process.argv.slice(2).map(Number);
  const fs = require('fs'); fs.mkdirSync(__dirname + '/prev', { recursive: true });
  for (let k = 0; k < times.length; k++) {
    await p.evaluate(t => render(t), times[k]);
    await p.screenshot({ path: `${__dirname}/prev/${String(k).padStart(3, '0')}.jpg`, type: 'jpeg', quality: 80 });
  }
  console.log('n', times.length);
  await b.close();
})();
