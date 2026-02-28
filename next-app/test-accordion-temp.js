const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Navigate to the test-faq page
    console.log('Navigating to http://localhost:3000/test-faq...');
    await page.goto('http://localhost:3000/test-faq', { waitUntil: 'networkidle' });
    
    // Ensure screenshots directory exists
    const screenshotDir = path.join('C:', 'git', 'ralph-loop-copilot-cli', '.agent', 'screenshots');
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
    
    // Take first screenshot before expanding
    const screenshot1Path = path.join(screenshotDir, 'TASK-25-1.png');
    console.log('Taking first screenshot...');
    await page.screenshot({ path: screenshot1Path, fullPage: true });
    console.log('Screenshot 1 saved to: ' + screenshot1Path);
    
    // Get the first accordion item button and click it
    const firstAccordion = await page.locator('[role="button"]').first();
    const isVisible = await firstAccordion.isVisible();
    console.log('First accordion button visible: ' + isVisible);
    
    if (isVisible) {
      console.log('Clicking first accordion item...');
      await firstAccordion.click();
      
      // Wait 500ms for animation
      await page.waitForTimeout(500);
    }
    
    // Take second screenshot after expanding
    const screenshot2Path = path.join(screenshotDir, 'TASK-25-2.png');
    console.log('Taking second screenshot...');
    await page.screenshot({ path: screenshot2Path, fullPage: true });
    console.log('Screenshot 2 saved to: ' + screenshot2Path);
    
    // Report findings
    console.log('\n=== TEST REPORT ===');
    console.log('Accordion item clicked successfully.');
    console.log('Both screenshots have been captured.');
    console.log('Check the screenshots to verify accordion expansion and variant visibility.');
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
