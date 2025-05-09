/**
 * Test Configuration
 * This file contains configuration options for the test automation framework
 */

module.exports = {
  // Browser settings
  browser: {
    // Which browser to use: 'chromium', 'firefox', or 'webkit'
    type: process.env.BROWSER || 'chromium',
    
    // Whether to run in headless mode (true) or with browser visible (false)
    headless: process.env.HEADLESS !== 'false',
    
    // Browser window size
    viewport: {
      width: 1280,
      height: 720
    },
    
    // Slow down operations by this many milliseconds (useful for debugging)
    slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 0,
    
    // Additional browser launch options
    launchOptions: {
      // Add any additional Playwright browser launch options here
    }
  },
  
  // Test execution settings
  test: {
    // Base URL for the application
    baseUrl: process.env.BASE_URL || 'https://stage.gatherit.co',
    
    // Global timeout for async operations (in milliseconds)
    timeout: parseInt(process.env.TIMEOUT || '30000'),
    
    // Whether to take screenshots on failure
    screenshotOnFailure: true,
    
    // Screenshots directory
    screenshotDir: './screenshots'
  },
  
  // Test data
  testData: {
    // Login credentials
    username: process.env.TEST_USERNAME || 'syed+483102@gatherit.co',
    password: process.env.TEST_PASSWORD || 'Vista123'
  }
}; 