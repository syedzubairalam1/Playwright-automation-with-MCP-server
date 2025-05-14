const { execSync } = require('child_process');
const path = require('path');

// Configuration
const baseUrl = process.env.MCP_BASE_URL || 'http://localhost:3000';
const headless = process.env.HEADLESS === 'true' ? 'true' : 'false';

console.log('Running Project CRUD tests with only project-steps.js...');

// Temporarily rename login-steps.js to avoid conflicts
const renameCommand = process.platform === 'win32' 
  ? 'ren steps\\login-steps.js login-steps.js.tmp'
  : 'mv steps/login-steps.js steps/login-steps.js.tmp';

try {
  // Rename the login steps file to avoid conflicts
  console.log('Temporarily disabling login-steps.js to avoid conflicts...');
  execSync(renameCommand, { stdio: 'inherit' });
  
  // Run cucumber with only project-steps.js
  const cucumberCommand = 
    `npx cucumber-js features/project-crud.feature ` +
    `--require steps/project-steps.js ` +
    `--require features/support ` +
    `--format html:cucumber-project-report.html`;
  
  console.log(`Executing: ${cucumberCommand}`);
  
  // Set environment variables
  const env = {
    ...process.env,
    MCP_BASE_URL: baseUrl,
    HEADLESS: headless,
    CUCUMBER_EXPRESSIONS_ONLY: 'true',
  };
  
  // Run the tests
  execSync(cucumberCommand, { 
    stdio: 'inherit',
    env: env
  });
  
  console.log('Tests completed!');
  
} catch (error) {
  console.error(`Error running tests: ${error.message}`);
} finally {
  // Restore login-steps.js regardless of test outcome
  const restoreCommand = process.platform === 'win32'
    ? 'ren steps\\login-steps.js.tmp login-steps.js'
    : 'mv steps/login-steps.js.tmp steps/login-steps.js';
  
  console.log('Restoring login-steps.js...');
  execSync(restoreCommand, { stdio: 'inherit' });
} 