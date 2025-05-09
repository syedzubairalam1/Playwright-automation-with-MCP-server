// Environment setup for Cucumber tests
const { setWorldConstructor, Before, After } = require('@cucumber/cucumber');
const { chromium, firefox, webkit } = require('playwright');
const config = require('../../config/test-config');
const fs = require('fs');
const path = require('path');

// Define World constructor for sharing data between steps
class CustomWorld {
  constructor() {
    this.scenarioContext = {};
    this.browser = null;
    this.page = null;
  }
  
  async getBrowser() {
    if (!this.browser) {
      // Select browser based on configuration
      const browserType = this.getBrowserType(config.browser.type);
      
      // Launch browser with configuration options
      this.browser = await browserType.launch({
        headless: config.browser.headless,
        slowMo: config.browser.slowMo,
        ...config.browser.launchOptions
      });
    }
    return this.browser;
  }
  
  async getPage() {
    if (!this.page) {
      const browser = await this.getBrowser();
      const context = await browser.newContext({
        viewport: config.browser.viewport
      });
      this.page = await context.newPage();
    }
    return this.page;
  }
  
  getBrowserType(type) {
    switch (type.toLowerCase()) {
      case 'firefox':
        return firefox;
      case 'webkit':
        return webkit;
      case 'chromium':
      default:
        return chromium;
    }
  }
  
  async takeScreenshot(scenarioName) {
    const page = await this.getPage();
    
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
    return filePath;
  }
}

setWorldConstructor(CustomWorld);

// Hooks
Before(async function() {
  // Get a page to use in the test
  await this.getPage();
  
  // Store the scenario for screenshots
  this.scenarioName = this.pickle?.name || 'unknown';
});

After(async function({ result }) {
  // Take screenshot on failure if configured
  if (result.status === 'FAILED' && config.test.screenshotOnFailure) {
    await this.takeScreenshot(this.scenarioName);
  }
  
  // Close browser
  if (this.browser) {
    await this.browser.close();
    this.browser = null;
    this.page = null;
  }
}); 