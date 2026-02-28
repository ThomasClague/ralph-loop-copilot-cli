import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 900 });

// Step 1: Navigate to the new batch page
await page.goto('http://localhost:3000/batches/new', { waitUntil: 'networkidle' });

// Step 2: Click the "Single Entry" tab
await page.getByRole('tab', { name: /single entry/i }).click();
await page.waitForTimeout(500);

// Step 3: Screenshot 1 - Tab B with Single Entry form
await page.screenshot({ path: 'C:/git/ralph-loop-copilot-cli/.agent/screenshots/TASK-59-1.png', fullPage: true });
console.log('Screenshot 1 saved');

// Step 4: Toggle "Has existing website?" switch ON
const websiteSwitch = page.getByRole('switch', { name: /has existing website/i });
const isSwitchOn = await websiteSwitch.getAttribute('aria-checked');
if (isSwitchOn !== 'true') {
  await websiteSwitch.click();
}
await page.waitForTimeout(500);

// Step 5: Screenshot 2 - should show URL field
await page.screenshot({ path: 'C:/git/ralph-loop-copilot-cli/.agent/screenshots/TASK-59-2.png', fullPage: true });
console.log('Screenshot 2 saved');

// Step 6: Fill in first prospect
await page.getByLabel(/business name/i).fill('Acme Roofing');
await page.getByLabel(/location/i).fill('London');

// Fill phone - try label first, fallback to placeholder
const phoneField = page.getByLabel(/phone/i).first();
await phoneField.fill('07700 900001');

// Step 7: Click "Add Prospect"
await page.getByRole('button', { name: /add prospect/i }).click();
await page.waitForTimeout(500);

// Step 8: Fill in second prospect
await page.getByLabel(/business name/i).fill('Beta Plumbing');
await page.getByLabel(/location/i).fill('Manchester');

// Step 9: Click "Add Prospect"
await page.getByRole('button', { name: /add prospect/i }).click();
await page.waitForTimeout(500);

// Step 10: Screenshot 3 - should show 2 prospects in table
await page.screenshot({ path: 'C:/git/ralph-loop-copilot-cli/.agent/screenshots/TASK-59-3.png', fullPage: true });
console.log('Screenshot 3 saved');

// Log page content for debugging
const tableContent = await page.locator('table, [role="table"], tbody').allTextContents();
console.log('Table content:', tableContent);

await browser.close();
console.log('Done');
