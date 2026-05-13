const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:1234');
  
  // Wait for the page to load
  await page.waitForSelector('text=Globex Inc');
  await page.click('text=Globex Inc');
  
  // Click Edit in Contact Info
  await page.waitForSelector('text=Edit');
  await page.click('text=Edit');
  
  // Select UK
  await page.selectOption('select', 'gb');
  
  // Clear and type phone
  await page.fill('input[type="tel"]', '7911123456');
  
  // Click Save
  await page.click('text=Save');
  
  // Wait a moment for re-render
  await page.waitForTimeout(500);
  
  // Take screenshot
  await page.screenshot({ path: 'uk_test.png' });
  
  // Edit again to select Canada
  await page.click('text=Edit');
  await page.selectOption('select', 'ca');
  await page.fill('input[type="tel"]', '4165550198');
  await page.click('text=Save');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'ca_test.png' });
  
  await browser.close();
  console.log("Screenshots captured!");
})();
