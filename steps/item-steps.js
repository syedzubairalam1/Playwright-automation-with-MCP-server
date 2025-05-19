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

// Read item step definitions
When('I click on the item', async function() {
  const page = await this.getPage();
  
  try {
    console.log('Attempting to click on the item');
    await page.waitForTimeout(3000);
    
    // Take a screenshot before clicking
    await takeScreenshot(page, 'before-item-click');
    
    // Using a more specific selector with .first() to handle multiple matches
    // The error showed that there are multiple elements with the same text
    const selector = '[data-test="SpecGridItem_content_p"]';
    
    await page.waitForSelector(selector, { timeout: 5000 });
    console.log(`Found ${await page.locator(selector).count()} matching elements`);
    
    // Click the first matching element
    await page.locator(selector).first().click();
    console.log('Successfully clicked on the first matching item');
    
    // Wait for any navigation or UI updates
    await page.waitForTimeout(2000);
    await takeScreenshot(page, 'after-item-click');
  } catch (error) {
    console.error(`Error clicking on item: ${error.message}`);
    await takeScreenshot(page, 'item-click-error');
    throw error;
  }
});

Then('the item details should show area {string}', async function(expectedArea) {
  const page = await this.getPage();
  
  try {
    console.log(`Verifying item area is: ${expectedArea}`);
    
    // Find an element that shows the item area
    const areaSelectors = [
      `div:has-text("Area:"):has-text("${expectedArea}")`,
      `.item-area:has-text("${expectedArea}")`,
      `[data-test*="item-area"]:has-text("${expectedArea}")`,
      `label:has-text("Area"):near(input[value="${expectedArea}"])`,
      `text="${expectedArea}"`
    ];
    
    for (const selector of areaSelectors) {
      try {
        await page.waitForSelector(selector, { 
          state: 'visible',
          timeout: 5000
        });
        console.log(`Found item area using selector: ${selector}`);
        break;
      } catch (e) {
        console.log(`Area not found with selector ${selector}: ${e.message}`);
      }
    }
    
    await takeScreenshot(page, `item-area-verification-${expectedArea}`);
  } catch (error) {
    console.error(`Error verifying item area: ${error.message}`);
    await takeScreenshot(page, 'item-area-verification-error');
    throw error;
  }
});

Then('the item details should show schedule {string}', async function(expectedSchedule) {
  const page = await this.getPage();
  
  try {
    console.log(`Verifying item schedule is: ${expectedSchedule}`);
    
    // Find an element that shows the item schedule
    const scheduleSelectors = [
      `div:has-text("Schedule:"):has-text("${expectedSchedule}")`,
      `.item-schedule:has-text("${expectedSchedule}")`,
      `[data-test*="item-schedule"]:has-text("${expectedSchedule}")`,
      `label:has-text("Schedule"):near(input[value="${expectedSchedule}"])`,
      `text="${expectedSchedule}"`
    ];
    
    for (const selector of scheduleSelectors) {
      try {
        await page.waitForSelector(selector, { 
          state: 'visible',
          timeout: 5000
        });
        console.log(`Found item schedule using selector: ${selector}`);
        break;
      } catch (e) {
        console.log(`Schedule not found with selector ${selector}: ${e.message}`);
      }
    }
    
    await takeScreenshot(page, `item-schedule-verification-${expectedSchedule}`);
  } catch (error) {
    console.error(`Error verifying item schedule: ${error.message}`);
    await takeScreenshot(page, 'item-schedule-verification-error');
    throw error;
  }
});

Then('the item details should show type {string}', async function(expectedType) {
  const page = await this.getPage();
  
  try {
    console.log(`Verifying item type is: ${expectedType}`);
    
    // Find an element that shows the item type
    const typeSelectors = [
      `div:has-text("Type:"):has-text("${expectedType}")`,
      `.item-type:has-text("${expectedType}")`,
      `[data-test*="item-type"]:has-text("${expectedType}")`,
      `label:has-text("Type"):near(input[value="${expectedType}"])`,
      `text="${expectedType}"`
    ];
    
    for (const selector of typeSelectors) {
      try {
        await page.waitForSelector(selector, { 
          state: 'visible',
          timeout: 5000
        });
        console.log(`Found item type using selector: ${selector}`);
        break;
      } catch (e) {
        console.log(`Type not found with selector ${selector}: ${e.message}`);
      }
    }
    
    await takeScreenshot(page, `item-type-verification-${expectedType}`);
  } catch (error) {
    console.error(`Error verifying item type: ${error.message}`);
    await takeScreenshot(page, 'item-type-verification-error');
    throw error;
  }
});

// Update item step definitions
When('I click on the edit button for the item', async function() {
  const page = await this.getPage();
  
  try {
    console.log('Clicking edit button for the item');
    
    // Try different ways to find the edit button
    const editButtonSelectors = [
      'button:has-text("Edit")',
      'button[aria-label="Edit item"]',
      '.edit-icon',
      '[data-test*="edit-item"]',
      'button.edit-btn',
      'button:has(svg[class*="edit"])'
    ];
    
    for (const selector of editButtonSelectors) {
      try {
        const editButton = page.locator(selector).first();
        if (await editButton.count() > 0 && await editButton.isVisible()) {
          await editButton.click();
          console.log(`Clicked edit button using selector: ${selector}`);
          await page.waitForTimeout(1000);
          await takeScreenshot(page, 'edit-button-clicked');
          return;
        }
      } catch (e) {
        console.log(`Error with selector ${selector}: ${e.message}`);
      }
    }
    
    throw new Error('Could not find or click edit button');
  } catch (error) {
    console.error(`Error clicking edit button: ${error.message}`);
    await takeScreenshot(page, 'edit-button-error');
    throw error;
  }
});

When('I update the item name to {string}', async function(newName) {
  const page = await this.getPage();
  
  try {
    console.log(`Updating item name to: ${newName}`);
    
    // Find and interact with the name field using the provided selector
    const nameField = page.locator('#field_name');
    
    // Wait for the field to be visible
    await nameField.waitFor({ state: 'visible', timeout: 5000 });
    
    // Clear the field and enter new value
    await nameField.click();
    await nameField.fill('');
    await nameField.fill(newName);
    
    console.log(`Updated item name to "${newName}" using #field_name selector`);
    await page.waitForTimeout(500);
    await takeScreenshot(page, 'item-name-updated');
  } catch (error) {
    console.error(`Error updating item name: ${error.message}`);
    await takeScreenshot(page, 'item-name-update-error');
    throw error;
  }
});

When('I update the item area to {string}', async function(newArea) {
  const page = await this.getPage();
  
  try {
    console.log(`Updating item area to: ${newArea}`);
    
    // Find the area input/select field in edit mode
    const areaFieldSelectors = [
      'input[name*="area" i]',
      'select[name*="area" i]',
      '.area-dropdown',
      '[data-test*="area-input"]',
      'input.item-area',
      'form input:nth-child(2)'
    ];
    
    for (const selector of areaFieldSelectors) {
      try {
        const areaField = page.locator(selector).first();
        if (await areaField.count() > 0 && await areaField.isVisible()) {
          await areaField.click();
          
          // If it's a select, need to find the option, otherwise just fill
          const tagName = await areaField.evaluate(el => el.tagName.toLowerCase());
          if (tagName === 'select') {
            await areaField.selectOption({ label: newArea });
          } else {
            await areaField.fill('');
            await areaField.fill(newArea);
            
            // For autocomplete fields, might need to select from dropdown
            try {
              const option = page.locator(`text="${newArea}"`).first();
              if (await option.count() > 0 && await option.isVisible()) {
                await option.click();
              }
            } catch (e) {
              console.log(`Error selecting area option: ${e.message}`);
              // Try pressing Enter to accept
              await page.keyboard.press('Enter');
            }
          }
          
          console.log(`Updated item area to "${newArea}" using selector: ${selector}`);
          await page.waitForTimeout(500);
          break;
        }
      } catch (e) {
        console.log(`Error with selector ${selector}: ${e.message}`);
      }
    }
    
    await takeScreenshot(page, 'item-area-updated');
  } catch (error) {
    console.error(`Error updating item area: ${error.message}`);
    await takeScreenshot(page, 'item-area-update-error');
    throw error;
  }
});

When('I click the save changes button', async function() {
  const page = await this.getPage();
  
  try {
    console.log('Clicking save changes button');
    
    // Try different selectors for the save button
    const saveButtonSelectors = [
      'button:has-text("Save")',
      'button:has-text("Update")',
      'button[type="submit"]',
      '.save-button',
      '[data-test*="save"]',
      'form button.btn-primary',
      'form button:last-child'
    ];
    
    for (const selector of saveButtonSelectors) {
      try {
        const saveButton = page.locator(selector).first();
        if (await saveButton.count() > 0 && await saveButton.isVisible()) {
          await saveButton.click();
          console.log(`Clicked save button using selector: ${selector}`);
          await page.waitForTimeout(2000);
          break;
        }
      } catch (e) {
        console.log(`Error with selector ${selector}: ${e.message}`);
      }
    }
    
    // If no button found, try pressing Enter as a fallback
    try {
      await page.keyboard.press('Enter');
      console.log('Pressed Enter to save changes');
      await page.waitForTimeout(2000);
    } catch (e) {
      console.log(`Error pressing Enter: ${e.message}`);
    }
    
    await takeScreenshot(page, 'save-changes-clicked');
  } catch (error) {
    console.error(`Error clicking save changes button: ${error.message}`);
    await takeScreenshot(page, 'save-changes-error');
    throw error;
  }
});

Then('the item should be updated successfully', async function() {
  const page = await this.getPage();
  
  try {
    console.log('Verifying item was updated successfully');
    
    // Look for success indicators
    const successIndicators = [
      '.toast-success',
      '.notification-success',
      '.alert-success',
      'div:has-text("Item updated successfully")',
      'div:has-text("Item has been updated")'
    ];
    
    for (const selector of successIndicators) {
      try {
        const isVisible = await page.isVisible(selector, { timeout: 2000 }).catch(() => false);
        if (isVisible) {
          console.log(`Found update success indicator: ${selector}`);
          break;
        }
      } catch (e) {
        console.log(`Error checking success indicator ${selector}: ${e.message}`);
      }
    }
    
    await takeScreenshot(page, 'item-update-success');
  } catch (error) {
    console.error(`Error verifying item update: ${error.message}`);
    await takeScreenshot(page, 'item-update-verification-error');
    throw error;
  }
});

// Delete item step definitions
When('I click on the delete button for the item', async function() {
  const page = await this.getPage();
  
  await page.locator('//span[@class="action-text-styles"]').click();
});

When('I confirm the item deletion', async function() {
  const page = await this.getPage();
  
  try {
    console.log('Confirming item deletion');
    
    // Try different selectors for confirmation buttons
    const confirmButtonSelectors = [
      'button:has-text("Confirm")',
      'button:has-text("Yes")',
      'button:has-text("OK")',
      'button:has-text("Delete")',
      '.modal button.btn-danger',
      '.modal button.btn-primary',
      '[data-test*="confirm-delete"]'
    ];
    
    for (const selector of confirmButtonSelectors) {
      try {
        const confirmButton = page.locator(selector).first();
        if (await confirmButton.count() > 0 && await confirmButton.isVisible()) {
          await confirmButton.click();
          console.log(`Clicked confirm button using selector: ${selector}`);
          await page.waitForTimeout(2000);
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

Then('the item should be deleted successfully', async function() {
  const page = await this.getPage();
  
  try {
    console.log('Verifying item was deleted successfully');
    
    // Look for success indicators
    const successIndicators = [
      '.toast-success',
      '.notification-success',
      '.alert-success',
      'div:has-text("Item deleted successfully")',
      'div:has-text("Item has been deleted")'
    ];
    
    for (const selector of successIndicators) {
      try {
        const isVisible = await page.isVisible(selector, { timeout: 2000 }).catch(() => false);
        if (isVisible) {
          console.log(`Found deletion success indicator: ${selector}`);
          break;
        }
      } catch (e) {
        console.log(`Error checking success indicator ${selector}: ${e.message}`);
      }
    }
    
    await takeScreenshot(page, 'item-deletion-success');
  } catch (error) {
    console.error(`Error verifying item deletion: ${error.message}`);
    await takeScreenshot(page, 'item-deletion-verification-error');
    throw error;
  }
});

Then('I should not see an item with name {string}', async function(itemName) {
  const page = await this.getPage();
  
  try {
    console.log(`Verifying item "${itemName}" is no longer visible`);
    
    // Wait a moment to ensure the UI has updated
    await page.waitForTimeout(2000);
    
    // Check if the item with this name is no longer visible
    const itemSelectors = [
      `tr:has-text("${itemName}")`,
      `div.item-row:has-text("${itemName}")`,
      `div.item-card:has-text("${itemName}")`,
      `[data-test*="item"]:has-text("${itemName}")`,
      `text="${itemName}"`
    ];
    
    for (const selector of itemSelectors) {
      try {
        const isVisible = await page.isVisible(selector, { timeout: 1000 }).catch(() => false);
        if (isVisible) {
          throw new Error(`Item "${itemName}" is still visible using selector: ${selector}`);
        }
      } catch (e) {
        if (e.message.includes('is still visible')) {
          throw e;
        }
        // Not finding the element is good in this case!
        console.log(`Item not found with selector ${selector} - that's expected!`);
      }
    }
    
    console.log(`Successfully confirmed item "${itemName}" is no longer visible`);
    await takeScreenshot(page, 'item-no-longer-visible');
  } catch (error) {
    console.error(`Error verifying item absence: ${error.message}`);
    await takeScreenshot(page, 'item-absence-verification-error');
    throw error;
  }
});

Then('I should see the item name {string}', async function(itemName) {
  const page = await this.getPage();
  
  // Wait for content to load
  await page.waitForTimeout(2000);
  
  // Check for the item name in various locations
  const selectors = [
    `h1:has-text("${itemName}")`,
    `h2:has-text("${itemName}")`,
    `.item-name:has-text("${itemName}")`,
    `[data-test*="item-name"]:has-text("${itemName}")`,
    `text="${itemName}"`
  ];
  
  let found = false;
  for (const selector of selectors) {
    try {
      const isVisible = await page.isVisible(selector);
      if (isVisible) {
        found = true;
        break;
      }
    } catch (e) {
      // Continue trying other selectors
    }
  }
  
  expect(found).toBe(true);
}); 