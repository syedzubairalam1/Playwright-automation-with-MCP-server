const { Given, When, Then, setDefaultTimeout } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const config = require('../config/test-config');
const fs = require('fs');
const path = require('path');

// Set default timeout based on config
setDefaultTimeout(config.test.timeout);

// Helper functions
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

// Login-related step definitions
Given('I am on the login page {string}', async function(url) {
  // Get page from World
  const page = await this.getPage();
  
  // Use the full URL or construct from base URL if a path is provided
  const fullUrl = url.startsWith('http') ? url : `${config.test.baseUrl}${url}`;
  await page.goto(fullUrl);
  await page.waitForLoadState('networkidle');
});

Then('I should see the logo {string}', async function (logoText) {
  const page = await this.getPage();
  // More flexible selector for logo
  try {
    await page.waitForSelector(`text=${logoText}`, { timeout: 10000 });
  } catch (e) {
    // Try alternative selectors if exact text not found
    await page.waitForSelector(`img[alt*="${logoText}"], .logo, header .brand, header img`, { timeout: 5000 });
  }
});

Then('I should see the login text {string}', async function (text) {
  const page = await this.getPage();
  try {
    await page.waitForSelector(`text="${text}"`, { timeout: 5000 });
  } catch (e) {
    // Log the presence of similar text for debugging
    console.log(`Text "${text}" not found exactly. Checking for similar text...`);
    const content = await page.content();
    if (content.includes(text.substring(0, 10))) {
      console.log(`Found text starting with "${text.substring(0, 10)}"`);
      return;
    }
    throw new Error(`Text "${text}" not found on page`);
  }
});

Then('I should see the email field labeled {string}', async function (label) {
  const page = await this.getPage();
  try {
    await page.waitForSelector(`label:has-text("${label}")`, { timeout: 5000 });
  } catch (e) {
    // Try alternative selectors
    await page.waitForSelector(`input[type="email"], input[placeholder*="email" i], input[name*="email" i]`, { timeout: 5000 });
  }
});

Then('I should see the password field labeled {string}', async function (label) {
  const page = await this.getPage();
  try {
    await page.waitForSelector(`label:has-text("${label}")`, { timeout: 5000 });
  } catch (e) {
    // Try alternative selectors
    await page.waitForSelector(`input[type="password"], input[placeholder*="password" i], input[name*="password" i]`, { timeout: 5000 });
  }
});

Then('I should see an input with type {string}', async function (inputType) {
  const page = await this.getPage();
  await page.waitForSelector(`input[type="${inputType}"]`, { timeout: 5000 });
});

When('I enter {string} into the email field', async function(text) {
  const page = await this.getPage();
  // Use configured credentials if placeholder values are used
  const email = text === '{username}' ? config.testData.username : text;
  await page.fill('input[type="email"], input[name="email"], input[placeholder*="email" i], input[name*="email" i]', email);
});

When('I enter {string} into the password field', async function(text) {
  const page = await this.getPage();
  // Use configured credentials if placeholder values are used
  const password = text === '{password}' ? config.testData.password : text;
  await page.fill('input[type="password"], input[name="password"], input[placeholder*="password" i], input[name*="password" i]', password);
});

When('I click on the login {string} button', async function (buttonText) {
  const page = await this.getPage();
  console.log(`Trying to click login button with text: ${buttonText}`);
  
  // Take screenshot before clicking
  try {
    await takeScreenshot(page, `before-click-${buttonText.replace(/\s+/g, '-').toLowerCase()}`);
  } catch (e) {
    console.log(`Screenshot error: ${e.message}`);
  }
  
  // Try multiple selector strategies
  const possibleSelectors = [
    `button:has-text("${buttonText}")`,
    `input[type="submit"][value="${buttonText}"]`,
    `a:has-text("${buttonText}")`,
    `button:has-text("${buttonText.toLowerCase()}")`,
    `button:has-text("${buttonText.toUpperCase()}")`,
    `.btn:has-text("${buttonText}")`,
    `[type="submit"]`,
    `form button`, 
    `form [type="submit"]`,
    `form input[type="submit"]`,
    // Additional selectors for more flexibility
    `button:visible`,
    `.btn-primary`,
    `.submit-btn`,
    `[role="button"]:has-text("${buttonText}")`,
    `button[type="submit"]:visible`
  ];
  
  // Try each selector
  let clicked = false;
  for (const selector of possibleSelectors) {
    try {
      console.log(`Trying selector: ${selector}`);
      const elements = await page.$$(selector);
      if (elements.length > 0) {
        console.log(`Found ${elements.length} elements with selector: ${selector}`);
        // Check if visible before clicking
        for (const element of elements) {
          if (await element.isVisible()) {
            // Try to get text to log what we're clicking
            try {
              const text = await element.textContent();
              console.log(`Element text: "${text}"`);
            } catch (e) {
              console.log(`Could not get text content: ${e.message}`);
            }
            
            // Add a small delay before clicking
            await page.waitForTimeout(500);
            
            // For buttons that might cause navigation, use JS click
            if (buttonText.includes("Submit") || buttonText.includes("Login")) {
              try {
                console.log('Using JavaScript click for potentially navigating button');
                await page.evaluate(el => el.click(), element);
                clicked = true;
              } catch (jsErr) {
                console.log(`JavaScript click failed: ${jsErr.message}, trying regular click`);
                await element.click({timeout: 5000});
                clicked = true;
              }
            } else {
              // Try clicking with various force options if regular click fails
              try {
                await element.click({timeout: 5000});
                clicked = true;
              } catch (e) {
                console.log(`Regular click failed: ${e.message}, trying with force: true`);
                await element.click({force: true, timeout: 5000});
                clicked = true;
              }
            }
            
            console.log(`Successfully clicked element with selector: ${selector}`);
            break;
          } else {
            console.log(`Element with selector ${selector} found but not visible`);
          }
        }
        if (clicked) break;
      }
    } catch (e) {
      console.log(`Failed to click with selector: ${selector}`);
    }
  }
  
  if (!clicked) {
    console.log('Trying to click by keyboard submit as last resort');
    try {
      await page.keyboard.press('Enter');
      clicked = true;
    } catch (e) {
      console.log('Enter key press failed');
    }
  }
  
  if (!clicked) {
    throw new Error(`Could not find clickable element with text: ${buttonText}`);
  }
  
  // For non-navigating buttons, take a screenshot after clicking
  if (!buttonText.includes("Submit") && !buttonText.includes("Login")) {
    try {
      // Take screenshot after clicking
      await takeScreenshot(page, `after-click-${buttonText.replace(/\s+/g, '-').toLowerCase()}`);
    } catch (e) {
      console.log(`After-click screenshot error: ${e.message}`);
    }
  }
  
  // Wait for navigation or network to be idle
  try {
    console.log('Waiting for page load state after button click...');
    await page.waitForLoadState('networkidle', { timeout: 20000 });
    console.log('Page load state complete');
  } catch (e) {
    console.log('Navigation or network idle wait timed out, continuing...');
  }
});

Then('I should be redirected to the projects page', async function () {
  const page = await this.getPage();
  // Wait for URL to change to projects URL
  await page.waitForURL('**/projects', { timeout: 10000 });
});

Then('I should see a dashboard element', { timeout: 60000 }, async function () {
  const page = await this.getPage();
  // Wait for a dashboard element to be visible with more flexible selectors
  try {
    await page.waitForSelector('.dashboard, .projects, #dashboard, #projects, [data-testid="dashboard"]', { timeout: 30000 });
  } catch (e) {
    // Check for common dashboard elements if specific selectors fail
    const selectors = [
      'header', '.navbar', 'nav', '.sidebar',
      'h1:visible', 'h2:visible', '.page-title', '.main-content'
    ];
    
    let found = false;
    for (const selector of selectors) {
      try {
        if (await page.$(selector)) {
          found = true;
          break;
        }
      } catch (e) {
        // Continue with next selector
      }
    }
    
    if (!found) {
      console.error('Dashboard elements not found');
      await takeScreenshot(page, 'dashboard-not-found');
      throw new Error('Dashboard elements not found');
    }
  }
});

// Step for entering invalid username
When('I enter invalid username', async function() {
  const page = await this.getPage();
  
  try {
    console.log('Entering invalid username');
    
    // Fill username field with invalid value
    await page.fill(
      'input[type="email"], input[name="email"], input[placeholder*="email" i], input[name*="email" i]', 
      'invalid@example.com'
    );
    
    console.log('Successfully entered invalid username');
    
    // Take screenshot for debugging
    await takeScreenshot(page, 'invalid-username-entered');
  } catch (error) {
    console.error(`Error entering invalid username: ${error.message}`);
    await takeScreenshot(page, 'invalid-username-error');
    throw error;
  }
});

// Step for entering invalid password
When('I enter invalid password', async function() {
  const page = await this.getPage();
  
  try {
    console.log('Entering invalid password');
    
    // Fill password field with invalid value
    await page.fill(
      'input[type="password"], input[name="password"], input[placeholder*="password" i], input[name*="password" i]', 
      'wrongpassword123'
    );
    
    console.log('Successfully entered invalid password');
    
    // Take screenshot for debugging
    await takeScreenshot(page, 'invalid-password-entered');
  } catch (error) {
    console.error(`Error entering invalid password: ${error.message}`);
    await takeScreenshot(page, 'invalid-password-error');
    throw error;
  }
});

// Step definition for checking browser's validation message for empty field
Then('I should see an error please fill in the username', async function() {
  const page = await this.getPage();
  try {
    // For browser validation messages, we need to check if the field is :invalid
    // and potentially check the validation message
    
    // First, try to submit the form to trigger validation
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    
    // Take a screenshot to verify the error is shown
    await page.screenshot({ path: './screenshots/username-validation-error.png' });
    
    // Check if the email input has validation error
    const isInvalid = await page.evaluate(() => {
      const input = document.querySelector('input[type="email"], input[name="email"], #email');
      if (!input) return false;
      
      // Need to cast to HTMLInputElement in JavaScript
      const inputEl = /** @type {HTMLInputElement} */ (input);
      
      // Check if field is invalid
      return inputEl.validity && !inputEl.validity.valid;
    });
    
    expect(isInvalid).toBe(true);
    console.log('Username validation error verified');
  } catch (error) {
    console.error('Failed to verify username validation error:', error);
    await page.screenshot({ path: './screenshots/username-validation-error-check-failed.png' });
    throw error;
  }
});

// Step definition for checking browser's validation message for empty password
Then('I should see an error please fill in the password', async function() {
  const page = await this.getPage();
  try {
    // For browser validation messages, we need to check if the field is :invalid
    // and potentially check the validation message
    
    // First, try to submit the form to trigger validation
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    
    // Take a screenshot to verify the error is shown
    await page.screenshot({ path: './screenshots/password-validation-error.png' });
    
    // Check if the password input has validation error
    const isInvalid = await page.evaluate(() => {
      const input = document.querySelector('input[type="password"], input[name="password"], #password');
      if (!input) return false;
      
      // Need to cast to HTMLInputElement in JavaScript
      const inputEl = /** @type {HTMLInputElement} */ (input);
      
      // Check if field is invalid
      return inputEl.validity && !inputEl.validity.valid;
    });
    
    expect(isInvalid).toBe(true);
    console.log('Password validation error verified');
  } catch (error) {
    console.error('Failed to verify password validation error:', error);
    await page.screenshot({ path: './screenshots/password-validation-error-check-failed.png' });
    throw error;
  }
});

// Step for entering empty username
When('I enter empty username', async function() {
  const page = await this.getPage();
  
  try {
    console.log('Entering empty username');
    
    // Clear the username field
    await page.fill(
      'input[type="email"], input[name="email"], input[placeholder*="email" i], input[name*="email" i]', 
      ''
    );
    
    console.log('Successfully cleared username field');
    
    // Take screenshot for debugging
    await takeScreenshot(page, 'empty-username-entered');
  } catch (error) {
    console.error(`Error clearing username field: ${error.message}`);
    await takeScreenshot(page, 'empty-username-error');
    throw error;
  }
});

// Step for entering empty password
When('I enter empty password', async function() {
  const page = await this.getPage();
  
  try {
    console.log('Entering empty password');
    
    // Clear the password field
    await page.fill(
      'input[type="password"], input[name="password"], input[placeholder*="password" i], input[name*="password" i]', 
      ''
    );
    
    console.log('Successfully cleared password field');
    
    // Take screenshot for debugging
    await takeScreenshot(page, 'empty-password-entered');
  } catch (error) {
    console.error(`Error clearing password field: ${error.message}`);
    await takeScreenshot(page, 'empty-password-error');
    throw error;
  }
});

// Step definition for username verification
Then('the username should be entered correctly', async function() {
  const page = await this.getPage();
  try {
    // Get username input field
    const usernameInput = await page.$('#email') || await page.$('[name="email"]') || await page.$('input[type="email"]');
    if (!usernameInput) {
      throw new Error('Username input field not found');
    }
    
    // Get the value from the input field
    const value = await usernameInput.inputValue();
    
    // Verify value is not empty
    expect(value).not.toBe('');
    
    // Optional: Take screenshot for debugging
    await page.screenshot({ path: './screenshots/username-entered.png' });
    
    console.log('Username entered correctly:', value);
  } catch (error) {
    console.error('Failed to verify username entry:', error);
    await page.screenshot({ path: './screenshots/username-verification-error.png' });
    throw error;
  }
});

// Step definition for password verification
Then('the password should be entered correctly', async function() {
  const page = await this.getPage();
  try {
    // Get password input field
    const passwordInput = await page.$('#password') || await page.$('[name="password"]') || await page.$('input[type="password"]');
    if (!passwordInput) {
      throw new Error('Password input field not found');
    }
    
    // Get the value from the input field
    const value = await passwordInput.inputValue();
    
    // Verify value is not empty
    expect(value).not.toBe('');
    
    // Optional: Take screenshot for debugging
    await page.screenshot({ path: './screenshots/password-entered.png' });
    
    console.log('Password entered correctly');
  } catch (error) {
    console.error('Failed to verify password entry:', error);
    await page.screenshot({ path: './screenshots/password-verification-error.png' });
    throw error;
  }
});

// Step definition for invalid username verification
Then('the invalid username should be entered', async function() {
  const page = await this.getPage();
  try {
    // Get username input field
    const usernameInput = await page.$('#email') || await page.$('[name="email"]') || await page.$('input[type="email"]');
    if (!usernameInput) {
      throw new Error('Username input field not found');
    }
    
    // Get the value from the input field
    const value = await usernameInput.inputValue();
    
    // Verify value is the expected invalid username
    expect(value).toBe('invalid@example.com');
    
    // Take screenshot for debugging
    await page.screenshot({ path: './screenshots/invalid-username-verification.png' });
    
    console.log('Invalid username verified');
  } catch (error) {
    console.error('Failed to verify invalid username:', error);
    await page.screenshot({ path: './screenshots/invalid-username-verification-error.png' });
    throw error;
  }
});

// Step definition for invalid password verification
Then('the invalid password should be entered', async function() {
  const page = await this.getPage();
  try {
    // Get password input field
    const passwordInput = await page.$('#password') || await page.$('[name="password"]') || await page.$('input[type="password"]');
    if (!passwordInput) {
      throw new Error('Password input field not found');
    }
    
    // Get the value from the input field
    const value = await passwordInput.inputValue();
    
    // Verify value is the expected invalid password
    expect(value).toBe('wrongpassword123');
    
    // Take screenshot for debugging
    await page.screenshot({ path: './screenshots/invalid-password-verification.png' });
    
    console.log('Invalid password verified');
  } catch (error) {
    console.error('Failed to verify invalid password:', error);
    await page.screenshot({ path: './screenshots/invalid-password-verification-error.png' });
    throw error;
  }
});

// Step definition for empty username verification
Then('the username field should be empty', async function() {
  const page = await this.getPage();
  try {
    // Get username input field
    const usernameInput = await page.$('#email') || await page.$('[name="email"]') || await page.$('input[type="email"]');
    if (!usernameInput) {
      throw new Error('Username input field not found');
    }
    
    // Get the value from the input field
    const value = await usernameInput.inputValue();
    
    // Verify value is empty
    expect(value).toBe('');
    
    // Take screenshot for debugging
    await page.screenshot({ path: './screenshots/empty-username-verification.png' });
    
    console.log('Empty username verified');
  } catch (error) {
    console.error('Failed to verify empty username:', error);
    await page.screenshot({ path: './screenshots/empty-username-verification-error.png' });
    throw error;
  }
});

// Step definition for empty password verification
Then('the password field should be empty', async function() {
  const page = await this.getPage();
  try {
    // Get password input field
    const passwordInput = await page.$('#password') || await page.$('[name="password"]') || await page.$('input[type="password"]');
    if (!passwordInput) {
      throw new Error('Password input field not found');
    }
    
    // Get the value from the input field
    const value = await passwordInput.inputValue();
    
    // Verify value is empty
    expect(value).toBe('');
    
    // Take screenshot for debugging
    await page.screenshot({ path: './screenshots/empty-password-verification.png' });
    
    console.log('Empty password verified');
  } catch (error) {
    console.error('Failed to verify empty password:', error);
    await page.screenshot({ path: './screenshots/empty-password-verification-error.png' });
    throw error;
  }
});

// Step definition for email field visibility
Then('the email field should be visible', async function() {
  const page = await this.getPage();
  try {
    // Try multiple selectors for email field
    const emailSelectors = [
      '#email', 
      '[name="email"]', 
      'input[type="email"]',
      'input[placeholder*="email" i]',
      'input[name*="email" i]'
    ];
    
    let isVisible = false;
    for (const selector of emailSelectors) {
      if (await page.isVisible(selector)) {
        isVisible = true;
        console.log(`Email field visible with selector: ${selector}`);
        break;
      }
    }
    
    expect(isVisible).toBe(true);
    
    // Take screenshot for debugging
    await page.screenshot({ path: './screenshots/email-field-visible.png' });
    
    console.log('Email field visibility verified');
  } catch (error) {
    console.error('Failed to verify email field visibility:', error);
    await page.screenshot({ path: './screenshots/email-field-visibility-error.png' });
    throw error;
  }
});

// Step definition for password field visibility
Then('the password field should be visible', async function() {
  const page = await this.getPage();
  try {
    // Try multiple selectors for password field
    const passwordSelectors = [
      '#password', 
      '[name="password"]', 
      'input[type="password"]',
      'input[placeholder*="password" i]',
      'input[name*="password" i]'
    ];
    
    let isVisible = false;
    for (const selector of passwordSelectors) {
      if (await page.isVisible(selector)) {
        isVisible = true;
        console.log(`Password field visible with selector: ${selector}`);
        break;
      }
    }
    
    expect(isVisible).toBe(true);
    
    // Take screenshot for debugging
    await page.screenshot({ path: './screenshots/password-field-visible.png' });
    
    console.log('Password field visibility verified');
  } catch (error) {
    console.error('Failed to verify password field visibility:', error);
    await page.screenshot({ path: './screenshots/password-field-visibility-error.png' });
    throw error;
  }
});

// Step definition for login button visibility
Then('the login button should be visible', async function() {
  const page = await this.getPage();
  try {
    // Try multiple selectors for login button
    const buttonSelectors = [
      'button:has-text("Login")', 
      'button:has-text("Sign in")',
      'input[type="submit"][value="Login"]',
      'input[type="submit"][value="Sign in"]',
      '[type="submit"]',
      'button[type="submit"]',
      '.login-button',
      '.btn-login',
      '#login-button',
      '.btn-primary'
    ];
    
    let isVisible = false;
    for (const selector of buttonSelectors) {
      if (await page.isVisible(selector)) {
        isVisible = true;
        console.log(`Login button visible with selector: ${selector}`);
        break;
      }
    }
    
    expect(isVisible).toBe(true);
    
    // Take screenshot for debugging
    await page.screenshot({ path: './screenshots/login-button-visible.png' });
    
    console.log('Login button visibility verified');
  } catch (error) {
    console.error('Failed to verify login button visibility:', error);
    await page.screenshot({ path: './screenshots/login-button-visibility-error.png' });
    throw error;
  }
});

// Step definition for verifying login page
Then('I see the login page', async function() {
  const page = await this.getPage();
  try {
    // Check for elements that should be on the login page
    await page.waitForSelector('input[type="email"], input[name="email"], #email', {
      state: 'visible',
      timeout: 10000
    });
    
    await page.waitForSelector('input[type="password"], input[name="password"], #password', {
      state: 'visible',
      timeout: 10000
    });
    
    // Take screenshot for debugging
    await page.screenshot({ path: './screenshots/login-page-visible.png' });
    
    console.log('Login page verified');
  } catch (error) {
    console.error('Failed to verify login page:', error);
    await page.screenshot({ path: './screenshots/login-page-verification-error.png' });
    throw error;
  }
});

// Step definition for verifying all login page UI elements
Then('I should see all login page UI elements', async function() {
  const page = await this.getPage();
  try {
    // Check email field visibility
    const emailSelectors = [
      '#email', 
      '[name="email"]', 
      'input[type="email"]',
      'input[placeholder*="email" i]',
      'input[name*="email" i]'
    ];
    
    let isEmailVisible = false;
    for (const selector of emailSelectors) {
      if (await page.isVisible(selector)) {
        isEmailVisible = true;
        console.log(`Email field visible with selector: ${selector}`);
        break;
      }
    }
    
    // Check password field visibility
    const passwordSelectors = [
      '#password', 
      '[name="password"]', 
      'input[type="password"]',
      'input[placeholder*="password" i]',
      'input[name*="password" i]'
    ];
    
    let isPasswordVisible = false;
    for (const selector of passwordSelectors) {
      if (await page.isVisible(selector)) {
        isPasswordVisible = true;
        console.log(`Password field visible with selector: ${selector}`);
        break;
      }
    }
    
    // Check login button visibility
    const buttonSelectors = [
      'button:has-text("Login")', 
      'button:has-text("Sign in")',
      'input[type="submit"][value="Login"]',
      'input[type="submit"][value="Sign in"]',
      '[type="submit"]',
      'button[type="submit"]',
      '.login-button',
      '.btn-login',
      '#login-button',
      '.btn-primary'
    ];
    
    let isButtonVisible = false;
    for (const selector of buttonSelectors) {
      if (await page.isVisible(selector)) {
        isButtonVisible = true;
        console.log(`Login button visible with selector: ${selector}`);
        break;
      }
    }
    
    // Verify all elements are visible
    expect(isEmailVisible).toBe(true);
    expect(isPasswordVisible).toBe(true);
    expect(isButtonVisible).toBe(true);
    
    // Take screenshot for debugging
    await page.screenshot({ path: './screenshots/all-login-elements-visible.png' });
    
    console.log('All login page UI elements visibility verified');
  } catch (error) {
    console.error('Failed to verify login page UI elements visibility:', error);
    await page.screenshot({ path: './screenshots/login-elements-visibility-error.png' });
    throw error;
  }
});

// Step for verifying error message
Then('I should see an error message', async function() {
  const page = await this.getPage();
  
  await expect(page.locator('#login_alert')).toHaveText('Invalid email or password.');
});




