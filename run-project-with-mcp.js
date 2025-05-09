// Script to run project CRUD tests with MCP server
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration
const serverPort = process.env.MCP_PORT || 3000;
const serverHost = process.env.MCP_HOST || 'localhost';
const serverUrl = `http://${serverHost}:${serverPort}`;
const headless = process.env.HEADLESS === 'true';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Log with timestamp and color
function log(message, color = colors.reset) {
  const timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  console.log(`${colors.bright}${timestamp}${colors.reset} ${color}${message}${colors.reset}`);
}

// Run MCP server
function startMcpServer() {
  log(`Starting MCP server on ${serverUrl}...`, colors.cyan);
  
  // Replace this with your actual server start command
  // This is a placeholder that simulates a server
  const server = spawn('node', ['-e', `
    const http = require('http');
    const fs = require('fs');
    const path = require('path');
    
    // Simulate MCP server
    const server = http.createServer((req, res) => {
      console.log(\`\${new Date().toISOString()} \${req.method} \${req.url}\`);
      
      // Handle login
      if (req.url.includes('/users/sign_in')) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<html><body><h1>Login</h1><form><input type="email" placeholder="Email"><input type="password" placeholder="Password"><button type="submit">Log In</button></form></body></html>');
      }
      // Handle projects page
      else if (req.url.includes('/projects')) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<html><body><h1>Projects</h1><button>Create New Project</button><div class="dashboard"></div></body></html>');
      }
      // Handle individual project
      else if (req.url.match(/\\/project\\/\\d+/)) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<html><body><h1>Project Details</h1><h2>Automation Test Project</h2><button>Edit Project</button><button>Delete Project</button></body></html>');
      }
      // Root redirect to login
      else if (req.url === '/') {
        res.writeHead(302, { 'Location': '/users/sign_in' });
        res.end();
      }
      // Not found
      else {
        res.writeHead(404);
        res.end('Not found');
      }
    });
    
    server.listen(${serverPort}, '${serverHost}', () => {
      console.log('MCP server running on ${serverUrl}');
    });
    
    // Keep server running until process is terminated
    process.on('SIGINT', () => {
      console.log('Shutting down server...');
      server.close();
      process.exit(0);
    });
  `]);
  
  server.stdout.on('data', (data) => {
    log(`SERVER: ${data}`, colors.green);
  });
  
  server.stderr.on('data', (data) => {
    log(`SERVER ERROR: ${data}`, colors.red);
  });
  
  // Give the server some time to start
  return new Promise((resolve) => {
    setTimeout(() => resolve(server), 2000);
  });
}

// Run Cucumber tests
function runCucumberTests() {
  log('Running Cucumber tests for project CRUD...', colors.magenta);
  
  // Create temp directory for steps if it doesn't exist
  const tempDir = path.join(__dirname, 'temp_steps');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }
  
  // Create a temporary file that includes only project-steps.js
  const tempFile = path.join(tempDir, 'temp-steps.js');
  fs.writeFileSync(tempFile, `
    // This file registers that we only want to use project-steps.js
    console.log("Using only project-steps.js for step definitions");
  `);
  
  // Set environment variables for the test run
  const env = {
    ...process.env,
    MCP_BASE_URL: serverUrl,
    HEADLESS: headless ? 'true' : 'false',
    SLOW_MO: '50',      // Slow down operations for better visibility
    TEST_USERNAME: 'test@example.com',
    TEST_PASSWORD: 'Password123!',
    CUCUMBER_EXPRESSIONS_ONLY: 'true', // Avoid regular expression conflicts
  };
  
  // Use npx for Windows compatibility
  const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  
  // Using a specific file and the tag
  const commandArgs = [
    'cucumber-js',
    'features/project-crud.feature',
    '--require', 'steps/project-steps.js',
    '--require', 'features/support',
    '--format', 'html:cucumber-project-report.html'
  ];
  
  log(`Running command: ${command} ${commandArgs.join(' ')}`, colors.yellow);
  
  const cucumber = spawn(command, commandArgs, { 
    env,
    stdio: 'inherit'  // Show output directly in the console
  });
  
  return new Promise((resolve, reject) => {
    cucumber.on('close', (code) => {
      if (code === 0) {
        log('Cucumber tests completed successfully', colors.green);
        resolve();
      } else {
        log(`Cucumber tests failed with code ${code}`, colors.red);
        reject(new Error(`Tests failed with code ${code}`));
      }
    });
  });
}

// Main function
async function main() {
  let server;
  
  try {
    // Start server
    server = await startMcpServer();
    log('MCP server started successfully', colors.green);
    
    // Run tests
    await runCucumberTests();
    
    log('All tests completed successfully!', colors.green);
  } catch (error) {
    log(`Error: ${error.message}`, colors.red);
    process.exit(1);
  } finally {
    // Clean up server process if it exists
    if (server) {
      log('Shutting down MCP server...', colors.cyan);
      server.kill();
    }
    
    // Clean up temp directory
    const tempDir = path.join(__dirname, 'temp_steps');
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
}

// Run the main function
main(); 