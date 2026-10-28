// 사용법: node build.js  →  경로식당_배식_자원봉사_제안서.pdf 생성
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 810 } });
  await page.goto('file://' + path.join(__dirname, 'index.html'));
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({
    path: path.join(__dirname, '경로식당_배식_자원봉사_제안서.pdf'),
    width: '1440px',
    height: '810px',
    printBackground: true,
    preferCSSPageSize: true,
  });
  await browser.close();
})();
