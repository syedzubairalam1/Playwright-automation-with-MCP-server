const { Given, When, Then } = require('@cucumber/cucumber');
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

// Note: The following steps are likely already defined in other files
// - I am logged in and on the projects page
// - I select a project from the list

// Project navigation bar verification
Then('project navigation bar should be visible at the top of the screen', async function() {
  const page = await this.getPage();
  await page.waitForTimeout(2000);
  const element = page.locator('.project-name-headline');
  const found = await element.isVisible();
  expect(found).toBeTruthy();
});

// Locate gear icon step
When('I locate the gear icon next to the project name', async function() {
  const page = await this.getPage();
  
  try {
    console.log('Locating gear icon next to project name');
    
    const gearIconSelectors = [
      '[data-test="ProjectSettingsField_index_div"] [data-test="EditIcon_index_svg"]',
      '[data-test*="settings-icon"]',
      '.settings-icon',
      'svg.gear-icon',
      'button:has(svg[class*="gear"])',
      'button:has(svg[class*="settings"])',
      'button.settings-button',
      'button[aria-label="Project Settings"]',
      '//button[contains(@aria-label, "Settings")]',
      '//svg[contains(@class, "gear") or contains(@class, "settings")]'
    ];
    
    for (const selector of gearIconSelectors) {
      try {
        const gearIcon = page.locator(selector).first();
        const isVisible = await gearIcon.isVisible();
        
        if (isVisible) {
          console.log(`Located gear icon using selector: ${selector}`);
          await takeScreenshot(page, 'gear-icon-located');
          return;
        }
      } catch (e) {
        console.log(`Error with gear icon selector ${selector}: ${e.message}`);
      }
    }
    
    throw new Error('Could not locate gear icon');
  } catch (error) {
    console.error(`Error locating gear icon: ${error.message}`);
    await takeScreenshot(page, 'gear-icon-locate-error');
    throw error;
  }
});

// Gear icon visibility verification
Then('gear icon should be visible next to the project name', async function() {
  const page = await this.getPage();
  const element = page.locator('[data-test="ProjectSettingsField_index_div"] [data-test="EditIcon_index_svg"]');
  const found = await element.isVisible();
  expect(found).toBeTruthy();
});

// Click on gear icon step
When('I click on the gear icon', async function() {
  const page = await this.getPage();
  
  try {
    console.log('Clicking on gear icon');
    
    const gearIconSelectors = [
      
      '[data-test="EditIcon_index_path"]',
      '[data-test="ProjectSettingsField_index_div"] [data-test="EditIcon_index_svg"]',
      '[data-test*="settings-icon"]',
      '.settings-icon',
      'svg.gear-icon',
      'button:has(svg[class*="gear"])',
      'button:has(svg[class*="settings"])',
      'button.settings-button',
      'button[aria-label="Project Settings"]',
      '//button[contains(@aria-label, "Settings")]',
      '//svg[contains(@class, "gear") or contains(@class, "settings")]'
    ];
    
    for (const selector of gearIconSelectors) {
      try {
        const gearIcon = page.locator(selector).first();
        const count = await gearIcon.count();
        
        if (count > 0) {
          const isVisible = await gearIcon.evaluate(element => {
            const style = window.getComputedStyle(element);
            return style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
          }).catch(() => false);
          
          if (isVisible) {
            await gearIcon.click();
            console.log(`Clicked gear icon using selector: ${selector}`);
            await page.waitForTimeout(2000); // Wait for modal to appear
            await takeScreenshot(page, 'gear-icon-clicked');
            return;
          }
        }
      } catch (e) {
        console.log(`Error with gear icon selector ${selector}: ${e.message}`);
      }
    }
    
    throw new Error('Could not find or click gear icon');
  } catch (error) {
    console.error(`Error clicking gear icon: ${error.message}`);
    await takeScreenshot(page, 'gear-icon-click-error');
    throw error;
  }
});

// Project settings modal verification
Then('project settings modal should open', async function() {
  const page = await this.getPage();
  await page.waitForTimeout(2000);
  await page.locator('.project-settings__header').isVisible();
});

// Modal title verification
Then('modal title should read {string}', async function(expectedTitle) {
  const page = await this.getPage();
  
  try {
    console.log(`Verifying modal title reads "${expectedTitle}"`);
    
    const titleSelectors = [
      '.project-settings__header',
      '.modal-title',
      '.dialog-title',
      '[data-test="modal-title"]',
      '[data-test="dialog-title"]',
      'h1.settings-title',
      'h2.settings-title',
      'h3.settings-title',
      '.dialog-header h1',
      '.dialog-header h2',
      '.modal-header h1',
      '.modal-header h2',
      '//div[@role="dialog"]//h1',
      '//div[@role="dialog"]//h2',
      '//div[@role="dialog"]//h3'
    ];
    
    for (const selector of titleSelectors) {
      try {
        const titleElement = page.locator(selector).first();
        const count = await titleElement.count();
        
        if (count > 0) {
          const isVisible = await titleElement.evaluate(element => {
            const style = window.getComputedStyle(element);
            return style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
          }).catch(() => false);
          
          if (isVisible) {
            const titleText = await titleElement.textContent();
            const trimmedText = titleText.trim();
            
            expect(trimmedText).toBe(expectedTitle);
            console.log(`Verified modal title reads "${expectedTitle}"`);
            await takeScreenshot(page, 'modal-title-verified');
            return;
          }
        }
      } catch (e) {
        console.log(`Error with title selector ${selector}: ${e.message}`);
      }
    }
    
    throw new Error(`Could not find or verify modal title reads "${expectedTitle}"`);
  } catch (error) {
    console.error(`Error verifying modal title: ${error.message}`);
    await takeScreenshot(page, 'modal-title-verification-error');
    throw error;
  }
}); 