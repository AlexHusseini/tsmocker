import { Parser } from '../src/parser';
import path from 'path';

describe('Parser', () => {
  let parser: Parser;
  
  beforeEach(() => {
    parser = new Parser();
  });
  
  test('should parse a simple interface correctly', () => {
    const examplePath = path.resolve(__dirname, '../examples/User.ts');
    
    // Use SimpleUser for test as it's more predictable
    const interfaceInfo = parser.parseFile(examplePath, 'SimpleUser');
    
    expect(interfaceInfo).toBeDefined();
    expect(interfaceInfo.name).toBe('SimpleUser');
    expect(interfaceInfo.properties).toHaveLength(4);
    
    // Check specific properties
    const idProp = interfaceInfo.properties.find(p => p.name === 'id');
    expect(idProp).toBeDefined();
    expect(idProp?.type).toBe('number');
    expect(idProp?.isOptional).toBe(false);
    
    const nameProp = interfaceInfo.properties.find(p => p.name === 'name');
    expect(nameProp).toBeDefined();
    expect(nameProp?.type).toBe('string');
    expect(nameProp?.isOptional).toBe(false);
    
    const activeProp = interfaceInfo.properties.find(p => p.name === 'active');
    expect(activeProp).toBeDefined();
    expect(activeProp?.type).toBe('boolean');
    expect(activeProp?.isOptional).toBe(false);
  });
  
  test('should throw error for non-existent interface', () => {
    const examplePath = path.resolve(__dirname, '../examples/User.ts');
    
    expect(() => {
      parser.parseFile(examplePath, 'NonExistentInterface');
    }).toThrow('Interface "NonExistentInterface" not found');
  });
}); 