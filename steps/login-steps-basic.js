// Basic login steps
const { Given, When, Then } = require('@cucumber/cucumber');
const config = require('../config/test-config');
const fs = require('fs');
const path = require('path');

// Helper function for taking screenshots
async function takeScreenshot(page, scenarioName) {
  // Ensure directory exists
  if (!fs.existsSync(config.test.screenshotDir)) {
    fs.mkdirSync(config.test.screenshotDir, { recursive: true });
  }
  
  // Create filename based on scenario and timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${scenarioName.replace(/\s+/g, '-')}-${timestamp}.png`;
  const filePath = path.join(config.test.screenshotDir, filename);
  
  // Take screenshot
  await page.screenshot({ path: filePath, fullPage: true });
  console.log(`Screenshot saved to: ${filePath}`);
}

// Step 1: Navigate to login page
Given('I navigate to the login page', async function() {
  const page = await this.getPage();
  
  try {
    console.log('Navigating to login page');
    
    // Navigate to login page
    await page.goto(`${config.test.baseUrl}/users/sign_in`);
    
    // Wait for page to load
    try {
      await page.waitForLoadState('domcontentloaded', { timeout: 10000 });
    } catch (e) {
      console.log('Timeout waiting for page to load, continuing anyway...');
    }
    
    console.log('Successfully navigated to login page');
    
    // Take screenshot for debugging
    await takeScreenshot(page, 'login-page');
  } catch (error) {
    console.error(`Error navigating to login page: ${error.message}`);
    await takeScreenshot(page, 'login-page-error');
    throw error;
  }
});

// Step 2: Enter username
When('I enter username', async function() {
  const page = await this.getPage();
  
  try {
    console.log('Entering username');
    
    // Fill username field using multiple selectors for robustness
    await page.fill(
      'input[type="email"], input[name="email"], input[placeholder*="email" i], input[name*="email" i]', 
      config.testData.username
    );
    
    console.log('Successfully entered username');
    
    // Take screenshot for debugging
    await takeScreenshot(page, 'username-entered');
  } catch (error) {
    console.error(`Error entering username: ${error.message}`);
    await takeScreenshot(page, 'username-error');
    throw error;
  }
});

// Step 3: Enter password
When('I enter password', async function() {
  const page = await this.getPage();
  
  try {
    console.log('Entering password');
    
    // Fill password field using multiple selectors for robustness
    await page.fill(
      'input[type="password"], input[name="password"], input[placeholder*="password" i], input[name*="password" i]', 
      config.testData.password
    );
    
    console.log('Successfully entered password');
    
    // Take screenshot for debugging
    await takeScreenshot(page, 'password-entered');
  } catch (error) {
    console.error(`Error entering password: ${error.message}`);
    await takeScreenshot(page, 'password-error');
    throw error;
  }
});

// Step 4: Click login button
When('I click on login button', async function() {
  const page = await this.getPage();
  
  await page.locator('input[type="submit"]').click();
}); 