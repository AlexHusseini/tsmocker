import { Generator } from '../src/generator';
import { InterfaceInfo, PropertyInfo } from '../src/types';

describe('Generator', () => {
  let generator: Generator;
  
  beforeEach(() => {
    generator = new Generator();
  });
  
  test('should generate mock data for a simple interface', () => {
    // Create a mock interface info manually
    const mockInterfaceInfo: InterfaceInfo = {
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
    
    // Generate a single mock object
    const mockData = generator.generateMockData(mockInterfaceInfo, 1);
    
    expect(mockData).toHaveLength(1);
    
    const mockUser = mockData[0] as Record<string, unknown>;
    expect(mockUser).toBeDefined();
    expect(typeof mockUser.id).toBe('number');
    expect(typeof mockUser.name).toBe('string');
    expect(typeof mockUser.email).toBe('string');
    expect(typeof mockUser.active).toBe('boolean');
  });
  
  test('should generate multiple mock objects', () => {
    // Create a simple mock interface
    const mockInterfaceInfo: InterfaceInfo = {
      name: 'SimpleTest',
      properties: [
        {
          name: 'id',
          type: 'number',
          isOptional: false,
        }
      ],
    };
    
    // Generate 5 mock objects
    const mockData = generator.generateMockData(mockInterfaceInfo, 5);
    
    expect(mockData).toHaveLength(5);
    mockData.forEach(item => {
      const mockItem = item as Record<string, unknown>;
      expect(typeof mockItem.id).toBe('number');
    });
  });
  
  test('should format output as JSON', () => {
    const mockData = [{ id: 1, name: 'Test' }];
    const output = generator.formatOutput(mockData, 'json');
    
    expect(output).toBe(JSON.stringify(mockData, null, 2));
    expect(() => JSON.parse(output)).not.toThrow();
  });
  
  test('should format output as CSV', () => {
    const mockData = [{ id: 1, name: 'Test' }];
    const output = generator.formatOutput(mockData, 'csv');
    
    expect(output).toContain('id,name');
    expect(output).toContain('1,Test');
  });
}); 