const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('CONSOLE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  page.on('requestfailed', req => console.log('REQUEST FAILED:', req.url(), req.failure().errorText));
  page.on('response', response => {
    if (!response.ok()) {
      console.log('RESPONSE NOT OK:', response.url(), response.status());
    }
  });

  await page.goto('https://doxhaul.pages.dev/login', { waitUntil: 'networkidle0' });
  
  await page.screenshot({ path: 'test_login.png' });
  
  const html = await page.evaluate(() => document.body.innerHTML);
  if (html.includes('Failed to fetch')) {
    console.log('BANNER FOUND!');
  } else {
    console.log('BANNER NOT FOUND');
  }

  await browser.close();
})();
