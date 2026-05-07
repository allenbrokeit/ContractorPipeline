const puppeteer = require('puppeteer');

(async () => {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.toString()));
    
    console.log('Navigating to http://localhost:1234/ ...');
    await page.goto('http://localhost:1234/', { waitUntil: 'networkidle0' });
    
    console.log('Looking for a secured contract block in the timeline...');
    const blockClickSuccess = await page.evaluate(() => {
      const blocks = Array.from(document.querySelectorAll('div[data-key="Block"]')).filter(div => 
        div.textContent.includes('/mo)') && !div.textContent.includes('[Pipeline]')
      );
      if (blocks.length > 0) {
        const block = blocks[0];
        console.log('Found block, tag:', block.tagName, 'data-key:', block.getAttribute('data-key'));
        block.click();
        return true;
      }
      return false;
    });
    console.log(`[Test] Clicked a secured contract timeline block: ${blockClickSuccess ? 'PASS' : 'FAIL'}`);
    
    // Give it a moment to route and render
    await new Promise(r => setTimeout(r, 500));
    
    const url = page.url();
    console.log(`[Test] Routed to /contracts page via Block: ${url.includes('/contracts') ? 'PASS' : 'FAIL'} (URL: ${url})`);

  } catch (error) {
    console.error('Test failed with error:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
})();