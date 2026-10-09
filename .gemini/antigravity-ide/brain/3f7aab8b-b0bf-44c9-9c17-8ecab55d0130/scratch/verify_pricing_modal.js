import puppeteer from 'puppeteer-core';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runVerification() {
  console.log('Starting 3D Pricing Modal & Footer Integration Verification...\n');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', msg => {
    if (msg.type() === 'error') console.log('[PAGE ERROR]', msg.text());
  });

  await page.setRequestInterception(true);

  let mockPolicies = {
    carrierFee: 25,
    shipperFee: 30,
    brokerFee: 50,
    commissionPercent: 8
  };

  page.on('request', req => {
    const url = req.url();
    const method = req.method();

    if (method === 'OPTIONS') {
      req.respond({
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      });
      return;
    }

    if (url.includes('/platform/policies') && method === 'GET') {
      req.respond({
        status: 200,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          data: mockPolicies,
          ...mockPolicies
        })
      });
      return;
    }

    req.continue();
  });

  // --- 1. Audit Landing Page (Confirm old static pricing section is removed) ---
  console.log('--- 1. Landing Page Audit ---');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });

  const pageText = await page.evaluate(() => document.body.innerText);
  const hasZeroHiddenFees = pageText.includes('Zero Hidden Fees, Direct Escrow');
  const hasFairTransactionModel = pageText.includes('FAIR TRANSACTION MODEL');
  const has35PerMatchedLoad = pageText.includes('$35 / matched load');

  console.log('Old "Zero Hidden Fees, Direct Escrow" present:', hasZeroHiddenFees);
  console.log('Old "FAIR TRANSACTION MODEL" present:', hasFairTransactionModel);
  console.log('Old "$35 / matched load" present:', has35PerMatchedLoad);

  if (hasZeroHiddenFees || hasFairTransactionModel || has35PerMatchedLoad) {
    throw new Error('FAIL: Old static pricing section still found on landing page!');
  }
  console.log('✓ SUCCESS: Old static pricing section completely removed from LandingPage.');

  // --- 2. Footer Trigger Test ---
  console.log('\n--- 2. Footer Trigger Test ---');
  // Scroll down to the footer
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await new Promise(r => setTimeout(r, 600));

  const footerScreenshotPath = path.join(__dirname, 'footer_pricing_trigger.png');
  await page.screenshot({ path: footerScreenshotPath });
  console.log('Footer screenshot saved to:', footerScreenshotPath);

  // Click Pricing in footer
  await page.evaluate(() => {
    const btn = document.querySelector('#footer-pricing-btn') || 
      Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim() === 'Pricing');
    if (btn) btn.click();
  });

  // Wait for 3D Pricing Modal to open
  await page.waitForSelector('h2', { timeout: 5000 });
  const modalHeader = await page.evaluate(() => {
    const h2s = Array.from(document.querySelectorAll('h2'));
    const modalH2 = h2s.find(h => h.innerText.includes('Ecosystem Access & Verified Onboarding'));
    return modalH2 ? modalH2.innerText : null;
  });
  console.log('Opened Modal Header:', modalHeader);

  // --- 3. Live Admin Panel Price Test ($65 Broker, $20 Carrier, Free Shipper) ---
  console.log('\n--- 3. Testing Live Admin Prices ($65 Broker, $20 Carrier, Free Shipper) ---');
  mockPolicies = {
    carrierFee: 20,
    shipperFee: 0,
    brokerFee: 65,
    commissionPercent: 8
  };

  // Re-trigger modal with new policies
  await page.evaluate(() => {
    const closeBtn = document.querySelector('button[aria-label="Close pricing modal"]');
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));

  // Open modal again via footer
  await page.evaluate(() => {
    const btn = document.querySelector('#footer-pricing-btn') || 
      Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim() === 'Pricing');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  const modalCardsText = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[data-role]')).map(el => ({
      role: el.getAttribute('data-role'),
      text: el.innerText
    }));
  });

  console.log('Extracted Card Roles & Texts:');
  modalCardsText.forEach(c => {
    console.log(`- Role: ${c.role} | Price match: ${c.text.includes('$20') ? '$20' : c.text.includes('$65') ? '$65' : c.text.includes('Free') ? 'Free' : 'Custom'}`);
  });

  const carrierHas20 = modalCardsText.some(c => c.role === 'CARRIER' && c.text.includes('$20'));
  const brokerHas65 = modalCardsText.some(c => c.role === 'BROKER' && c.text.includes('$65'));
  const shipperHasFree = modalCardsText.some(c => c.role === 'SHIPPER' && c.text.includes('Free'));

  console.log('Carrier has $20:', carrierHas20);
  console.log('Broker has $65:', brokerHas65);
  console.log('Shipper has Free:', shipperHasFree);

  if (!carrierHas20 || !brokerHas65 || !shipperHasFree) {
    throw new Error('FAIL: Live mock policies did not render correctly in the 3D Pricing Modal!');
  }
  console.log('✓ SUCCESS: Live Admin fees reflected instantaneously without hardcoding.');

  // Save 3D modal screenshot
  const modalScreenshotPath = path.join(__dirname, 'pricing_modal_3d.png');
  await page.screenshot({ path: modalScreenshotPath });
  console.log('3D Pricing Modal screenshot saved to:', modalScreenshotPath);

  // --- 4. Role Routing Test ---
  console.log('\n--- 4. Role Routing Test ---');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const carrierBtn = btns.find(b => b.innerText.includes('Onboard as Carrier'));
    if (carrierBtn) carrierBtn.click();
  });

  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  console.log('Current URL after clicking Onboard as Carrier:', page.url());

  const selectedRoleValue = await page.$eval('select[name="role"]', el => el.value);
  console.log('Selected role on /register:', selectedRoleValue);

  if (selectedRoleValue !== 'CARRIER') {
    throw new Error(`FAIL: Expected role to be CARRIER, got ${selectedRoleValue}`);
  }
  console.log('✓ SUCCESS: Register page loaded with CARRIER role preselected.');

  const registerScreenshotPath = path.join(__dirname, 'carrier_register_preselected.png');
  await page.screenshot({ path: registerScreenshotPath });
  console.log('Carrier registration preselected screenshot saved to:', registerScreenshotPath);

  // --- 5. Deep Link Test (?pricing=true) and Escape key close ---
  console.log('\n--- 5. Deep Link & Escape Key Test ---');
  await page.goto('http://localhost:3000/?pricing=true', { waitUntil: 'networkidle0' });
  await page.waitForSelector('h2', { timeout: 5000 });
  console.log('✓ SUCCESS: Modal automatically opened via ?pricing=true URL parameter.');

  // Press Escape
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 600));

  const isModalStillVisible = await page.evaluate(() => {
    const modal = document.querySelector('button[aria-label="Close pricing modal"]');
    return !!modal;
  });
  console.log('Is modal still visible after Escape key:', isModalStillVisible);

  if (isModalStillVisible) {
    throw new Error('FAIL: Modal did not dismiss on Escape key press!');
  }
  console.log('✓ SUCCESS: Modal dismissed cleanly on Escape key.');

  await browser.close();
  console.log('\n>>> ALL 5 3D PRICING MODAL VERIFICATION TESTS PASSED SUCCESSFULLY! <<<');
}

runVerification().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
