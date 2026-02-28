const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/test-section-renderer', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'C:\\git\\ralph-loop-copilot-cli\\.agent\\screenshots\\TASK-38-1.png', fullPage: true });
  console.log('Screenshot saved successfully');
  await browser.close();
})();
