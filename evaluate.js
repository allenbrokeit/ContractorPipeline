const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('http://localhost:1234/', { waitUntil: 'networkidle0' });

  // Get info from FinancialHealthGauge
  const gaugeInfo = await page.evaluate(() => {
    const stats = Array.from(document.querySelectorAll('span')).find(el => el.textContent.includes('secured'));
    const container = stats ? stats.closest('div').previousElementSibling : null;
    const segments = container ? Array.from(container.children[0]?.children || []) : [];
    return {
      statsText: stats ? stats.textContent : 'Not found',
      segments: segments.map(s => ({
        width: s.style.width,
        title: s.getAttribute('title')
      }))
    };
  });

  // Get info from TimelineGantt
  const timelineInfo = await page.evaluate(() => {
    const blocks = Array.from(document.querySelectorAll('div')).filter(div => div.textContent.includes('/mo)'));
    return blocks.map(b => ({
      text: b.textContent,
      width: b.style.width,
      left: b.style.left
    }));
  });

  console.log(JSON.stringify({ gaugeInfo, timelineInfo }, null, 2));
  await browser.close();
})();
