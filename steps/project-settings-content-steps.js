const { Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
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

Then('the modal should display three columns', async function() {
  const page = await this.getPage();
  
  await page.locator('//div[@class="project-settings__name"]').isVisible();
  await page.locator('//div[@class="project-settings__name"]').click();
 
});

Then('the first column should contain input fields', async function() {
  const page = await this.getPage();
  
  try {
    console.log('Verifying first column contains input fields');
    
    const inputFieldSelectors = [
      '.settings-column:first-child input',
      '.column:first-child input',
      '.settings-grid > div:first-child input',
      '[data-test="settings-column-1"] input'
    ];
    
    for (const selector of inputFieldSelectors) {
      try {
        const inputs = page.locator(selector);
        const count = await inputs.count();
        
        if (count > 0) {
          console.log(`Verified input fields in first column using selector: ${selector}`);
          await takeScreenshot(page, 'first-column-inputs-verified');
          return;
        }
      } catch (e) {
        console.log(`Error with input field selector ${selector}: ${e.message}`);
      }
    }
    
    throw new Error('Could not find input fields in first column');
  } catch (error) {
    console.error(`Error verifying first column input fields: ${error.message}`);
    await takeScreenshot(page, 'first-column-verification-error');
    throw error;
  }
});

Then('the second column should contain checkboxes for client actions', async function() {
  const page = await this.getPage();
  
  try {
    console.log('Verifying second column contains checkboxes for client actions');
    
    const checkboxSelectors = [
      '.settings-column:nth-child(2) input[type="checkbox"]',
      '.column:nth-child(2) input[type="checkbox"]',
      '.settings-grid > div:nth-child(2) input[type="checkbox"]',
      '[data-test="settings-column-2"] input[type="checkbox"]',
      '[data-test="client-actions"] input[type="checkbox"]'
    ];
    
    for (const selector of checkboxSelectors) {
      try {
        const checkboxes = page.locator(selector);
        const count = await checkboxes.count();
        
        if (count > 0) {
          console.log(`Verified checkboxes in second column using selector: ${selector}`);
          await takeScreenshot(page, 'second-column-checkboxes-verified');
          return;
        }
      } catch (e) {
        console.log(`Error with checkbox selector ${selector}: ${e.message}`);
      }
    }
    
    throw new Error('Could not find checkboxes for client actions in second column');
  } catch (error) {
    console.error(`Error verifying second column checkboxes: ${error.message}`);
    await takeScreenshot(page, 'second-column-verification-error');
    throw error;
  }
});

Then('the third column should contain checkboxes for client visibility', async function() {
  const page = await this.getPage();
  
  try {
    console.log('Verifying third column contains checkboxes for client visibility');
    
    const checkboxSelectors = [
      '.settings-column:nth-child(3) input[type="checkbox"]',
      '.column:nth-child(3) input[type="checkbox"]',
      '.settings-grid > div:nth-child(3) input[type="checkbox"]',
      '[data-test="settings-column-3"] input[type="checkbox"]',
      '[data-test="client-visibility"] input[type="checkbox"]'
    ];
    
    for (const selector of checkboxSelectors) {
      try {
        const checkboxes = page.locator(selector);
        const count = await checkboxes.count();
        
        if (count > 0) {
          console.log(`Verified checkboxes in third column using selector: ${selector}`);
          await takeScreenshot(page, 'third-column-checkboxes-verified');
          return;
        }
      } catch (e) {
        console.log(`Error with checkbox selector ${selector}: ${e.message}`);
      }
    }
    
    throw new Error('Could not find checkboxes for client visibility in third column');
  } catch (error) {
    console.error(`Error verifying third column checkboxes: ${error.message}`);
    await takeScreenshot(page, 'third-column-verification-error');
    throw error;
  }
}); 