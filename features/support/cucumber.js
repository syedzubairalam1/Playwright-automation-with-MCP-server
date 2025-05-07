// Configuration for Cucumber.js to properly map step definitions
const { setWorldConstructor, setDefaultTimeout } = require('@cucumber/cucumber');
const config = require('../../config/test-config');

// Set timeout based on config
setDefaultTimeout(config.test.timeout);

// Define World constructor for sharing data between steps
class CustomWorld {
  constructor() {
    this.scenarioContext = {};
  }
}

setWorldConstructor(CustomWorld);

// Register step definition files - helps with navigation
module.exports = {
  default: {
    paths: ['features/*.feature'],
    require: ['steps/*.js'],
    requireModule: [],
    format: ['progress-bar', 'html:cucumber-report.html'],
    publishQuiet: true
  }
}; 