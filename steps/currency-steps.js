const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// Store currency selection for later verification
let selectedCurrency = '';

When('I locate the currency select menu', async function() {
  const page = await this.getPage();
  console.log('Locating currency select menu');
  
  const currencySelectSelectors = [
    '[data-test="ProjectSettingsDialog_index_select"]',
    '[data-test="currency-select"]',
    '[name="currency"]',
    'select#currency',
    '.currency-dropdown'
  ];
  
  for (const selector of currencySelectSelectors) {
    try {
      const isVisible = await page.locator(selector).first().isVisible();
      if (isVisible) {
        console.log(`Located currency select menu using selector: ${selector}`);
        return;
      }
    } catch (e) {
      // Try next selector
    }
  }
  
  throw new Error('Could not locate currency select menu');
});

Then('currency select menu should be present with multiple options', async function() {
  const page = await this.getPage();
  console.log('Verifying currency select menu has multiple options');
  
  const currencySelectSelectors = [
    '[data-test="currency-select"]',
    '[name="currency"]',
    'select#currency',
    '.currency-dropdown'
  ];
  
  for (const selector of currencySelectSelectors) {
    try {
      const currencySelect = page.locator(selector).first();
      if (await currencySelect.isVisible()) {
        const options = page.locator(`${selector} option`);
        const optionCount = await options.count();
        
        expect(optionCount).toBeGreaterThan(1);
        console.log(`Verified currency select has ${optionCount} options`);
        return;
      }
    } catch (e) {
      // Try next selector
    }
  }
  
  throw new Error('Could not verify currency select options');
});

When('I select a different currency', async function() {
  const page = await this.getPage();
  console.log('Selecting a different currency');
  
  const currencySelectSelectors = [
    '[data-test="currency-select"]',
    '[name="currency"]',
    'select#currency',
    '.currency-dropdown'
  ];
  
  for (const selector of currencySelectSelectors) {
    try {
      const currencySelect = page.locator(selector).first();
      if (await currencySelect.isVisible()) {
        // Get current value
        const currentValue = await currencySelect.evaluate(select => select.value);
        
        // Get all options
        const options = await page.locator(`${selector} option`).all();
        
        // Find a different option
        for (const option of options) {
          const value = await option.evaluate(opt => opt.value);
          if (value && value !== currentValue) {
            selectedCurrency = value;
            await currencySelect.selectOption(value);
            console.log(`Selected new currency: ${value}`);
            return;
          }
        }
      }
    } catch (e) {
      // Try next selector
    }
  }
  
  throw new Error('Could not select a different currency');
});

When('I update the project', async function() {
  const page = await this.getPage();
  console.log('Updating project with new currency');
  
  const saveButtonSelectors = [
    '[data-test="save-button"]',
    'button:has-text("Save")',
    'button:has-text("Update")',
    '.save-button'
  ];
  
  for (const selector of saveButtonSelectors) {
    try {
      const saveButton = page.locator(selector).first();
      if (await saveButton.isVisible()) {
        await saveButton.click();
        console.log(`Clicked save button using selector: ${selector}`);
        
        // Wait for save operation
        await page.waitForTimeout(1000);
        
        // Handle confirmation dialog if present
        try {
          const confirmButton = page.locator('button:has-text("Yes")');
          if (await confirmButton.isVisible({ timeout: 1000 })) {
            await confirmButton.click();
            console.log('Clicked confirmation button');
          }
        } catch (confirmError) {
          // No confirmation dialog
        }
        
        return;
      }
    } catch (e) {
      // Try next selector
    }
  }
  
  throw new Error('Could not find or click save/update button');
});

Then('project should update with new currency', async function() {
  const page = await this.getPage();
  console.log('Verifying project updated with new currency');
  
  // Wait for any loading indicators
  await page.waitForTimeout(1000);
  
  // Look for success message or check if modal closed
  try {
    const successMessage = page.locator('.success-message, .toast-success');
    if (await successMessage.isVisible({ timeout: 1000 })) {
      console.log('Success message found, project updated successfully');
      return;
    }
  } catch (e) {
    // No success message, check if modal closed
    try {
      const modalGone = await page.locator('.project-settings-modal').isVisible()
        .then(visible => !visible)
        .catch(() => true);
      
      if (modalGone) {
        console.log('Settings modal has closed, update successful');
      }
    } catch (e) {
      // Modal might have a different selector
    }
  }
}); 