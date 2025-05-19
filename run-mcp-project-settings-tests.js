// Script to run Project Settings tests using MCP server
const { execSync } = require('child_process');
const path = require('path');

// Configuration
const config = {
  featureFile: 'features/project-settings-update-mcp.feature',
  tag: '@project-settings-mcp',
  mcpServer: true,
  browser: 'chromium',
  headless: false,
  timeout: 60000
};

console.log('Starting MCP Server for Project Settings tests...');

// Build the cucumber command
let cucumberCommand = 'npx cucumber-js';

// Add feature file if specified
if (config.featureFile) {
  cucumberCommand += ` ${config.featureFile}`;
}

// Add tag if specified
if (config.tag) {
  cucumberCommand += ` --tags ${config.tag}`;
}

// Set environment variables
const env = {
  ...process.env,
  MCP_SERVER: config.mcpServer ? 'true' : 'false',
  BROWSER: config.browser,
  HEADLESS: config.headless ? 'true' : 'false',
  TEST_TIMEOUT: config.timeout.toString()
};

// Set require path for MCP world
cucumberCommand += ' --require support/mcp-world.js --require steps/project-settings-mcp-steps.js';

// Add HTML report
cucumberCommand += ' --format html:reports/project-settings-mcp-report.html';

console.log(`Executing command: ${cucumberCommand}`);

try {
  // Execute the command
  execSync(cucumberCommand, {
    env,
    stdio: 'inherit'
  });
  console.log('Tests completed successfully!');
} catch (error) {
  console.error('Tests failed with error:', error.message);
  process.exit(1);
} 