// End-to-end test script
const { Parser } = require('./dist/parser');
const { Generator } = require('./dist/generator');
const path = require('path');
const fs = require('fs');

// CLI arguments simulation
const schema = path.resolve(__dirname, 'examples/User.ts');
const interfaceName = 'User';
const count = 3;
const outputFormat = 'json';
const outputFile = 'output.json';

console.log(`=== TSMocker E2E Test ===`);
console.log(`Reading interface "${interfaceName}" from ${schema}`);
console.log(`Generating ${count} mock objects in ${outputFormat} format\n`);

try {
  // 1. Parse the TypeScript interface
  console.log('Step 1: Parsing interface...');
  const parser = new Parser();
  const interfaceInfo = parser.parseFile(schema, interfaceName);
  console.log(`Parsed interface with ${interfaceInfo.properties.length} properties`);
  
  // 2. Generate mock data
  console.log('\nStep 2: Generating mock data...');
  const generator = new Generator();
  const mockData = generator.generateMockData(interfaceInfo, count);
  console.log(`Generated ${mockData.length} mock objects`);
  
  // 3. Format output
  console.log('\nStep 3: Formatting output...');
  const output = generator.formatOutput(mockData, outputFormat);
  
  // 4. Write output to file
  console.log('\nStep 4: Writing output to file...');
  fs.writeFileSync(outputFile, output);
  console.log(`Output written to ${outputFile}`);
  
  // 5. Display sample output
  console.log('\nSample output:');
  if (outputFormat === 'json') {
    const prettyOutput = JSON.stringify(JSON.parse(output)[0], null, 2);
    console.log(prettyOutput);
  } else {
    console.log(output.split('\n').slice(0, 5).join('\n') + '\n...');
  }
  
  console.log('\nE2E test completed successfully!');
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
} 