# MCP Test Automation

This project contains automated tests using Cucumber.js and Playwright.

## Setup

1. Install dependencies:
```
npm install
```

## Configuration

The test configuration is managed in `config/test-config.js`. You can modify this file directly or use environment variables to override the default settings.

### Key Configuration Options

- **Browser Type**: Choose between Chromium, Firefox, or WebKit
- **Headless Mode**: Run tests with or without visible browser
- **Viewport Size**: Configure browser window dimensions
- **Test Timeouts**: Set global timeout for test steps
- **Screenshots**: Enable/disable screenshots on test failure
- **Test Data**: Configure test credentials and other data

### Environment Variables

You can use the following environment variables to override configuration:

- `BROWSER`: Set browser type ('chromium', 'firefox', 'webkit')
- `HEADLESS`: Control headless mode ('true', 'false')
- `SLOW_MO`: Add delay between test actions in milliseconds
- `TIMEOUT`: Set global timeout in milliseconds
- `BASE_URL`: Override the base URL
- `TEST_USERNAME`: Set test username
- `TEST_PASSWORD`: Set test password

## Running Tests

### Basic Usage

Run all feature tests:
```
npm run mcp
```

### Run Options

- **Headless Mode (default)**: `npm run mcp:headless`
- **Headed Mode (browser visible)**: `npm run mcp:headed`
- **Specific Browser**:
  - Firefox: `npm run mcp:firefox`
  - WebKit: `npm run mcp:webkit`
  - Chromium: `npm run mcp:chrome`
- **Run only login tests**: `npm run mcp:login`
- **Slow motion for debugging**: `npm run mcp:slow`
- **Generate HTML report**: `npm run mcp:report`

### Custom Environment Variables

You can also set custom environment variables before running tests:

```
set BASE_URL=https://dev.gatherit.co&& npm run mcp
```

For multiple options:
```
set HEADLESS=false&& set BROWSER=firefox&& set SLOW_MO=50&& npm run mcp
```

## Screenshots

When a test fails, a screenshot is automatically captured and saved to the `screenshots` directory (if enabled in config).

## Feature Files

The tests are written in Gherkin format in `.feature` files. The main features include:

- Login functionality
- Project creation
- Item management 