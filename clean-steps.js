/*
This script helps identify duplicate step definitions.
Run with:
node clean-steps.js
*/

const fs = require('fs');
const path = require('path');

// Read the login-steps.js file
const loginFilePath = path.join(__dirname, 'steps', 'login-steps.js');
const loginFileContent = fs.readFileSync(loginFilePath, 'utf8');

// Read the project-steps.js file
const projectFilePath = path.join(__dirname, 'steps', 'project-steps.js');
const projectFileContent = fs.readFileSync(projectFilePath, 'utf8');

// Function to extract step definitions from a file
function extractStepDefinitions(fileContent, fileName) {
  // Using a more comprehensive regex that matches Given, When, and Then
  const stepRegex = /(?:Given|When|Then)\s*\(\s*['"]([^'"]+)['"]/g;
  const steps = [];
  let match;

  while ((match = stepRegex.exec(fileContent)) !== null) {
    const stepName = match[1];
    const lineNumber = fileContent.substring(0, match.index).split('\n').length;
    steps.push({ name: stepName, file: fileName, line: lineNumber });
  }

  return steps;
}

// Extract step definitions from both files
const loginSteps = extractStepDefinitions(loginFileContent, 'login-steps.js');
const projectSteps = extractStepDefinitions(projectFileContent, 'project-steps.js');

console.log(`Found ${loginSteps.length} steps in login-steps.js`);
console.log(`Found ${projectSteps.length} steps in project-steps.js`);

// Find steps that are in both files
const loginStepNames = loginSteps.map(step => step.name);
const projectStepNames = projectSteps.map(step => step.name);

// Find overlapping step names
const conflicts = loginStepNames.filter(name => projectStepNames.includes(name));

// Print conflicts
console.log('\nStep definition conflicts between login-steps.js and project-steps.js:');
if (conflicts.length === 0) {
  console.log('\nNo conflicts found!');
} else {
  console.log(`Found ${conflicts.length} conflicts:`);
  
  conflicts.forEach(name => {
    const loginStep = loginSteps.find(step => step.name === name);
    const projectStep = projectSteps.find(step => step.name === name);
    
    console.log(`\nStep: "${name}"`);
    console.log(`Found in ${loginStep.file} on line ${loginStep.line}`);
    console.log(`Found in ${projectStep.file} on line ${projectStep.line}`);
  });
}

console.log('\nTotal steps:', loginSteps.length + projectSteps.length);
console.log('Unique step patterns:', new Set([...loginStepNames, ...projectStepNames]).size);
console.log('Conflicts:', conflicts.length);

// List all step definition patterns from project-steps.js for reference
console.log('\nStep definitions in project-steps.js:');
projectSteps.forEach(step => {
  console.log(`- ${step.name}`);
}); 