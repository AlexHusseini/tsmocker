// Simple parser test script
const { Parser } = require('./dist/parser');
const path = require('path');

const parser = new Parser();

try {
  // Parse the SimpleUser interface from our examples
  const simpleUserInterface = parser.parseFile(
    path.resolve(__dirname, 'examples/User.ts'),
    'SimpleUser'
  );
  
  console.log('Successfully parsed SimpleUser interface:');
  console.log(JSON.stringify(simpleUserInterface, null, 2));
  
  // Parse the full User interface
  const userInterface = parser.parseFile(
    path.resolve(__dirname, 'examples/User.ts'),
    'User'
  );
  
  console.log('\nSuccessfully parsed User interface:');
  console.log(`Name: ${userInterface.name}`);
  console.log(`Number of properties: ${userInterface.properties.length}`);
  
  // List all property names and types
  console.log('\nProperties:');
  userInterface.properties.forEach(prop => {
    console.log(`- ${prop.name}: ${prop.type}${prop.isOptional ? ' (optional)' : ''}`);
  });
} catch (error) {
  console.error('Error:', error.message);
} 