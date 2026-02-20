const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const url = process.argv[2] || 'http://localhost:3000/';
  const outScreenshot = process.argv[3] || 'scripts/page_screenshot.png';
  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  const logs = [];
  page.on('console', msg => {
    try {
      logs.push({type: 'console', level: msg.type(), text: msg.text()});
    } catch(e) { logs.push({type:'console', text: String(msg)}); }
  });
  page.on('pageerror', err => logs.push({type:'pageerror', message: err.message, stack: err.stack}));
  page.on('requestfailed', req => logs.push({type:'requestfailed', url: req.url(), errorText: req.failure && req.failure().errorText}));
  try {
    const resp = await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    const status = resp ? resp.status() : null;
    await page.screenshot({ path: outScreenshot, fullPage: true });
    const title = await page.title().catch(() => '');
    const html = await page.content();
    const result = { url, status, title, screenshot: outScreenshot, logs, htmlLength: html.length };
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('ERROR', err && err.message ? err.message : err);
    try { await page.screenshot({ path: outScreenshot, fullPage: true }); } catch(e){}
    process.exitCode = 2;
  } finally {
    try { await browser.close(); } catch(e){}
  }
})();