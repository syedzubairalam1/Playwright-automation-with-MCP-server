// Script to run tests with MCP server
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration
const serverPort = process.env.MCP_PORT || 3000;
const serverHost = process.env.MCP_HOST || 'localhost';
const serverUrl = `http://${serverHost}:${serverPort}`;

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

// Ensure screenshots directory exists
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

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
        res.end('<html><body><h1>Gather Login</h1><form><input type="email" placeholder="Email"><input type="password" placeholder="Password"><button type="submit">Log In</button></form></body></html>');
      }
      // Handle projects page
      else if (req.url.includes('/projects')) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<html><body><h1>Projects</h1><button>Create New Project</button><div class="dashboard"></div></body></html>');
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
  log('Running Cucumber tests...', colors.magenta);
  
  // Set environment variables for the test run
  const env = {
    ...process.env,
    MCP_BASE_URL: serverUrl,
    HEADLESS: 'false',  // Run in headed mode for better debugging
    SLOW_MO: '50',      // Slow down operations for better visibility
    TEST_USERNAME: 'test@example.com',
    TEST_PASSWORD: 'Password123!'
  };
  
  // Get the command line arguments (excluding node and script name)
  const args = process.argv.slice(2);
  
  // FIX: Use npx for Windows compatibility
  const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  let commandArgs = ['cucumber-js'];
  
  // Check if specific tests were requested
  if (args.length > 0) {
    if (args[0] === 'project') {
      commandArgs.push('--tags', '@project');
    } else if (args[0] === 'login') {
      commandArgs.push('--tags', '@login');
    } else if (args[0] === 'item') {
      commandArgs.push('--tags', '@item');
    } else {
      // If argument doesn't match a known tag, pass it through to cucumber
      commandArgs = commandArgs.concat(args);
    }
  }
  
  // Add formatter for nice output
  commandArgs.push('--format', 'html:cucumber-report.html');
  
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
  }
}

// Run the main function
main(); 