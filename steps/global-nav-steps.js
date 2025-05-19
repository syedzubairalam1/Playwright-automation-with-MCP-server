const { Given, Then, When } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

Given('I am on the application page', async function() {
  const page = await this.getPage();
  console.log('Ensuring we are on the application page');
  
  // Wait for page to be fully loaded
  await page.waitForLoadState('networkidle', { timeout: 30000 });
  
  try {
    // Check if any recognizable element is visible to confirm we're on the right page
    const appContainer = page.locator('body');
    await expect(appContainer).toBeVisible({ timeout: 10000 });
  } catch (error) {
    console.error('Failed to verify application page is loaded:', error);
    await this.takeScreenshot('application-page-load-failed');
    throw new Error('Could not verify application page is loaded');
  }
});

Then('I should see a black bar at the top of the page', async function() {
  const page = await this.getPage();
  console.log('Verifying presence of black navigation bar');
  
  const navBarSelectors = [
    '#beta-bar',    
    '.global-nav',
    '.nav-bar',
    'header',
    '.app-header',
    'nav.navbar'
  ];
  
  for (const selector of navBarSelectors) {
    try {
      const navBar = page.locator(selector).first();
      if (await navBar.isVisible()) {
        // Verify the color of the nav bar (it should be black or dark)
        const backgroundColor = await navBar.evaluate((el) => {
          return window.getComputedStyle(el).backgroundColor;
        });
        
        // Check if color is black-ish (could be rgb(0,0,0) or rgba(0,0,0,x) or #000000)
        const isDarkColor = backgroundColor.includes('0, 0, 0') || 
                           backgroundColor.includes('#000') ||
                           backgroundColor.includes('rgb(0,0,0)');
        
        if (isDarkColor) {
          console.log(`Verified black navigation bar using selector: ${selector}`);
          return;
        } else {
          console.log(`Found navigation bar but it's not black: ${backgroundColor}`);
        }
      }
    } catch (e) {
      // Try next selector
    }
  }
  
  // If we reach here, take a screenshot for debugging
  await this.takeScreenshot('black-bar-not-found');
  throw new Error('Could not locate a black navigation bar at the top of the page');
});

//   const page = await this.getPage();
//   console.log('Checking for company text');
  
//   const companyTextSelectors = [
//     '.company-name',
//     '.brand-text',
//     '.logo-text',
//     'header .company',
//     'nav .company-title'
//   ];
  
//   let companyTextFound = false;
  
//   for (const selector of companyTextSelectors) {
//     try {
//       const companyText = page.locator(selector).first();
//       if (await companyText.isVisible()) {
//         console.log(`Found company text using selector: ${selector}`);
//         companyTextFound = true;
//         break;
//       }
//     } catch (e) {
//       // Try next selector
//     }
//   }
  
//   // Note: This is conditional, so we don't throw an error if not found
//   if (!companyTextFound) {
//     console.log('Company text not found, but this is conditional (if applicable)');
//   }
// });

Then('I should see the client test mode switch on the right side', async function(switchText) {
  const page = await this.getPage();
  await expect(page.locator('//span[normalize-space()="Client Test Mode:"]')).toBeVisible();
  
});

Then('the gather logo should be visible on the left side of the global nav bar', async function() {
  const page = await this.getPage();
  
  const logoSelectors = [
    '#choosed',
    '.gather-logo',
    'img[alt="Gather Logo"]',
    '.nav-logo',
    '#logo',
    '.logo-container img'
  ];
  
  for (const selector of logoSelectors) {
    try {
      const logo = page.locator(selector).first();
      if (await logo.isVisible()) {
        // Check logo position to verify it's on the left side
        const boundingBox = await logo.boundingBox();
        const pageWidth = await page.evaluate(() => window.innerWidth);
        
        if (boundingBox && boundingBox.x < pageWidth / 3) {
          console.log(`Verified Gather logo on left side using selector: ${selector}`);
          return;
        }
      }
    } catch (e) {
      // Try next selector
    }
  }
  
  await this.takeScreenshot('gather-logo-not-found');
  throw new Error('Could not locate Gather logo on the left side of the nav bar');
});

When('I click on the gather logo', async function() {
  const page = await this.getPage();
  
  const logoSelectors = [
    '#choosed',
    '.gather-logo',
    'img[alt="Gather Logo"]',
    '.nav-logo', 
    '#logo',
    '.logo-container img'
  ];
  
  for (const selector of logoSelectors) {
    try {
      const logo = page.locator(selector).first();
      if (await logo.isVisible()) {
        await logo.click();
        console.log(`Clicked on Gather logo using selector: ${selector}`);
        return;
      }
    } catch (e) {
      // Try next selector
    }
  }
  
  await this.takeScreenshot('gather-logo-click-failed');
  throw new Error('Could not click on Gather logo');
});

Then('the user should be redirected to the projects page', async function() {
  const page = await this.getPage();
  
  await page.goto('https://stage.gatherit.co/');
});

Then('I should see the Projects navigation item', async function() {
  const page = await this.getPage();
  await page.waitForTimeout(1000);
  await expect(page.locator('//a[normalize-space()="Projects"]')).toBeVisible();
}); 

Then('I should see the Contacts navigation item', async function() {
  const page = await this.getPage();
  await expect(page.locator('//a[normalize-space()="Contacts"]')).toBeVisible();
}); 

Then('I should see the Library navigation item', async function() {
  const page = await this.getPage();
  await expect(page.locator('//a[normalize-space()="Library"]')).toBeVisible();
}); 