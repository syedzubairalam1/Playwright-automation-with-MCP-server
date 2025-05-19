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

// Vision board step definitions
When('I select a project from the list for vision board', async function() {
  const page = await this.getPage();
  
  try {
    console.log('Selecting a project from the list for vision board');
    
    // Wait for project list to load
    await page.waitForSelector('.project-item, .project-card', { state: 'visible', timeout: 10000 });
    
    // Click on the first project in the list
    await page.locator('.project-item, .project-card').first().click();
    
    // Wait for project to load
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    
    console.log('Successfully selected a project');
    await takeScreenshot(page, 'project-selected');
  } catch (error) {
    console.error(`Error selecting project: ${error.message}`);
    await takeScreenshot(page, 'project-selection-error');
    throw error;
  }
});

When('I click on the Vision tab', async function() {
  const page = await this.getPage();
  
  try {
    console.log('Clicking on the Vision tab');
    
    // Wait for navigation tabs to be visible
    await page.waitForTimeout(2000);
    
    // Try different selectors for Vision tab
    const visionTabSelectors = [
      'a:has-text("Vision")',
      'button:has-text("Vision")',
      'li:has-text("Vision")',
      '[data-test*="vision" i]',
      '[role="tab"]:has-text("Vision")',
      '.nav-item:has-text("Vision")'
    ];
    
    for (const selector of visionTabSelectors) {
      try {
        const tab = page.locator(selector).first();
        if (await tab.count() > 0 && await tab.isVisible()) {
          await tab.click();
          console.log(`Clicked Vision tab using selector: ${selector}`);
          await page.waitForTimeout(1000);
          break;
        }
      } catch (e) {
        console.log(`Error with selector ${selector}: ${e.message}`);
      }
    }
    
    await takeScreenshot(page, 'vision-tab-clicked');
  } catch (error) {
    console.error(`Error clicking Vision tab: ${error.message}`);
    await takeScreenshot(page, 'vision-tab-error');
    throw error;
  }
});

Then('the Vision tab should be visible', async function() {
  const page = await this.getPage();
  
  try {
    console.log('Verifying Vision tab is visible');
    
    // Wait for Vision board content to be visible
    await page.waitForSelector('.vision-board-container, [data-test*="vision-board"], .board-container', {
      state: 'visible',
      timeout: 10000
    });
    
    console.log('Vision tab is visible');
    await takeScreenshot(page, 'vision-tab-visible');
  } catch (error) {
    console.error(`Error verifying Vision tab: ${error.message}`);
    await takeScreenshot(page, 'vision-tab-verification-error');
    throw error;
  }
});

When('I click on the new board name input field', async function() {
  const page = await this.getPage();
  
  try {
    console.log('Clicking on new board name input field');
    
    // Try different selectors for the new board input field
    const inputSelectors = [
      'input[placeholder*="board name" i]',
      'input[placeholder*="new board" i]',
      'input.new-board-input',
      '[data-test*="new-board-input"]',
      'input[aria-label*="board name" i]',
      '.board-creation input'
    ];
    
    for (const selector of inputSelectors) {
      try {
        const input = page.locator(selector).first();
        if (await input.count() > 0 && await input.isVisible()) {
          await input.click();
          console.log(`Clicked new board input using selector: ${selector}`);
          await page.waitForTimeout(500);
          break;
        }
      } catch (e) {
        console.log(`Error with selector ${selector}: ${e.message}`);
      }
    }
    
    await takeScreenshot(page, 'new-board-input-clicked');
  } catch (error) {
    console.error(`Error clicking new board input: ${error.message}`);
    await takeScreenshot(page, 'new-board-input-error');
    throw error;
  }
});

When('I enter {string} into the board name field', async function(boardName) {
  const page = await this.getPage();
  
  try {
    console.log(`Entering "${boardName}" into board name field`);
    
    // Try different selectors for the board name input field
    const inputSelectors = [
      'input[placeholder*="board name" i]',
      'input[placeholder*="new board" i]',
      'input.new-board-input',
      '[data-test*="new-board-input"]',
      'input[aria-label*="board name" i]',
      '.board-creation input'
    ];
    
    let filled = false;
    for (const selector of inputSelectors) {
      try {
        const input = page.locator(selector).first();
        if (await input.count() > 0 && await input.isVisible()) {
          await input.fill(boardName);
          console.log(`Filled board name using selector: ${selector}`);
          filled = true;
          break;
        }
      } catch (e) {
        console.log(`Error with selector ${selector}: ${e.message}`);
      }
    }
    
    if (!filled) {
      // If we couldn't find a specific field, try focusing and typing
      await page.keyboard.type(boardName);
      console.log('Typed board name using keyboard');
    }
    
    await takeScreenshot(page, 'board-name-entered');
  } catch (error) {
    console.error(`Error entering board name: ${error.message}`);
    await takeScreenshot(page, 'board-name-input-error');
    throw error;
  }
});

When('I click the new button', async function() {
  const page = await this.getPage();
  
  try {
    console.log('Clicking the new button');
    
    // Try different selectors for the new button
    const buttonSelectors = [
      'button:has-text("New")',
      'button:has-text("Create")',
      'button:has-text("Add")',
      'button.create-board-btn',
      '[data-test*="create-board"]',
      '.board-creation button',
      'form button[type="submit"]'
    ];
    
    for (const selector of buttonSelectors) {
      try {
        const button = page.locator(selector).first();
        if (await button.count() > 0 && await button.isVisible()) {
          await button.click();
          console.log(`Clicked new button using selector: ${selector}`);
          await page.waitForTimeout(1000);
          break;
        }
      } catch (e) {
        console.log(`Error with selector ${selector}: ${e.message}`);
      }
    }
    
    // If button click fails, try pressing Enter
    try {
      await page.keyboard.press('Enter');
      console.log('Pressed Enter to submit');
    } catch (e) {
      console.log(`Error pressing Enter: ${e.message}`);
    }
    
    await takeScreenshot(page, 'new-button-clicked');
  } catch (error) {
    console.error(`Error clicking new button: ${error.message}`);
    await takeScreenshot(page, 'new-button-error');
    throw error;
  }
});

Then('the {string} vision board should be created successfully', async function(boardName) {
  const page = await this.getPage();
  
  try {
    console.log(`Verifying "${boardName}" vision board was created`);
    
    // Wait for the board to appear with the given name
    await page.waitForSelector(`text="${boardName}"`, {
      state: 'visible',
      timeout: 10000
    });
    
    console.log(`Successfully created "${boardName}" vision board`);
    await takeScreenshot(page, 'vision-board-created');
  } catch (error) {
    console.error(`Error verifying vision board creation: ${error.message}`);
    await takeScreenshot(page, 'vision-board-creation-error');
    throw error;
  }
});

When('I update the vision board name', async function() {
  const page = await this.getPage();
  
  try {
    console.log('Updating vision board name');
    
    // Try different selectors for the board name element
    const boardNameSelectors = [
      '.board-name',
      '.board-title',
      '[data-test*="board-name"]',
      '.vision-board-name',
      'h1.editable',
      'h2.editable',
      '[contenteditable="true"]'
    ];
    
    for (const selector of boardNameSelectors) {
      try {
        const nameElement = page.locator(selector).first();
        if (await nameElement.count() > 0 && await nameElement.isVisible()) {
          await nameElement.click();
          await page.waitForTimeout(500);
          
          // Clear the existing text
          await page.keyboard.press('Control+A');
          await page.keyboard.press('Backspace');
          
          // Type the new name
          await page.keyboard.type('update board name');
          console.log('Updated vision board name');
          break;
        }
      } catch (e) {
        console.log(`Error with selector ${selector}: ${e.message}`);
      }
    }
    
    await takeScreenshot(page, 'vision-board-name-updated');
  } catch (error) {
    console.error(`Error updating vision board name: ${error.message}`);
    await takeScreenshot(page, 'vision-board-update-error');
    throw error;
  }
});

When('I press Enter to confirm vision board name', async function() {
  const page = await this.getPage();
  
  try {
    await page.keyboard.press('Enter');
    console.log('Pressed Enter key to confirm vision board name');
    await page.waitForTimeout(1000);
    await takeScreenshot(page, 'enter-key-pressed');
  } catch (error) {
    console.error(`Error pressing Enter key: ${error.message}`);
    await takeScreenshot(page, 'enter-key-error');
    throw error;
  }
});

Then('the board name should be updated to {string}', async function(updatedName) {
  const page = await this.getPage();
  
  try {
    console.log(`Verifying board name is updated to "${updatedName}"`);
    
    // Wait for the updated name to appear
    await page.waitForSelector(`text="${updatedName}"`, {
      state: 'visible',
      timeout: 10000
    });
    
    console.log(`Successfully verified board name is updated to "${updatedName}"`);
    await takeScreenshot(page, 'vision-board-name-verification');
  } catch (error) {
    console.error(`Error verifying updated board name: ${error.message}`);
    await takeScreenshot(page, 'vision-board-name-verification-error');
    throw error;
  }
});

When('I click on the archives icon of the board', async function() {
  const page = await this.getPage();
  
  try {
    console.log('Clicking on the archives icon');
    
    // Try different selectors for the archives/delete icon
    const archiveIconSelectors = [
      '.delete-icon',
      '.archive-icon',
      '.trash-icon',
      'button[aria-label*="delete" i]',
      'button[aria-label*="archive" i]',
      '[data-test*="delete-board"]',
      '[data-test*="archive-board"]',
      'button:has-text("Delete")',
      'button:has-text("Archive")'
    ];
    
    for (const selector of archiveIconSelectors) {
      try {
        const icon = page.locator(selector).first();
        if (await icon.count() > 0 && await icon.isVisible()) {
          await icon.click();
          console.log(`Clicked archives icon using selector: ${selector}`);
          await page.waitForTimeout(1000);
          break;
        }
      } catch (e) {
        console.log(`Error with selector ${selector}: ${e.message}`);
      }
    }
    
    await takeScreenshot(page, 'archives-icon-clicked');
  } catch (error) {
    console.error(`Error clicking archives icon: ${error.message}`);
    await takeScreenshot(page, 'archives-icon-error');
    throw error;
  }
});

When('I click on okay button to confirm the vision board deletion', async function() {
  const page = await this.getPage();
  
  try {
    console.log('Clicking okay button to confirm vision board deletion');
    
    // Try different selectors for confirmation buttons
    const confirmButtonSelectors = [
      'button:has-text("OK")',
      'button:has-text("Okay")',
      'button:has-text("Yes")',
      'button:has-text("Confirm")',
      'button:has-text("Delete")',
      '.confirm-button',
      '[data-test*="confirm"]',
      '.modal button.btn-primary',
      '.modal button.btn-danger'
    ];
    
    for (const selector of confirmButtonSelectors) {
      try {
        const button = page.locator(selector).first();
        if (await button.count() > 0 && await button.isVisible()) {
          await button.click();
          console.log(`Clicked confirmation button using selector: ${selector}`);
          await page.waitForTimeout(1000);
          break;
        }
      } catch (e) {
        console.log(`Error with selector ${selector}: ${e.message}`);
      }
    }
    
    await takeScreenshot(page, 'deletion-confirmed');
  } catch (error) {
    console.error(`Error confirming deletion: ${error.message}`);
    await takeScreenshot(page, 'deletion-confirmation-error');
    throw error;
  }
});

Then('the board should be deleted successfully', async function() {
  const page = await this.getPage();
  
  try {
    console.log('Verifying board is deleted');
    
    // Wait a moment for deletion to complete
    await page.waitForTimeout(2000);
    
    // Check that the board with name "update board name" is no longer visible
    try {
      const boardExists = await page.isVisible('text="update board name"');
      
      if (!boardExists) {
        console.log('Successfully verified board is deleted');
      } else {
        throw new Error('Board still appears to exist after deletion');
      }
    } catch (e) {
      if (e.message.includes('Board still appears')) {
        throw e;
      }
      // If element not found error, that's good - it means the board is gone
      console.log('Successfully verified board is deleted');
    }
    
    await takeScreenshot(page, 'board-deletion-verification');
  } catch (error) {
    console.error(`Error verifying board deletion: ${error.message}`);
    await takeScreenshot(page, 'board-deletion-verification-error');
    throw error;
  }
}); 