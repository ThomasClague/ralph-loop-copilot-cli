const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/test-blog-preview', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'C:\\git\\ralph-loop-copilot-cli\\.agent\\screenshots\\TASK-35-1.png', fullPage: true });
  console.log('Screenshot saved successfully');
  await browser.close();
})();
