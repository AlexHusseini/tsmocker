// Simple test script
const { Generator } = require('./dist/generator');

const generator = new Generator();

// Create a mock interface info manually
const mockInterfaceInfo = {
  name: 'SimpleUser',
  properties: [
    {
      name: 'id',
      type: 'number',
      isOptional: false,
    },
    {
      name: 'name',
      type: 'string',
      isOptional: false,
    },
    {
      name: 'email',
      type: 'string',
      isOptional: false,
    },
    {
      name: 'active',
      type: 'boolean',
      isOptional: false,
    },
  ],
};

// Generate 2 mock objects
const mockData = generator.generateMockData(mockInterfaceInfo, 2);
const output = generator.formatOutput(mockData, 'json');

console.log(output); 