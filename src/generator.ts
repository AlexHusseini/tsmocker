import { faker } from '@faker-js/faker';
import { stringify } from 'csv-stringify/sync';
import { InterfaceInfo, PropertyInfo, TypeKind, OutputFormat } from './types';

const OPTIONAL_PROPERTY_CHANCE = 0.7;
const DEFAULT_ARRAY_MIN_LENGTH = 1;
const DEFAULT_ARRAY_MAX_LENGTH = 5;
const DEFAULT_AGE_MIN = 18;
const DEFAULT_AGE_MAX = 90;
const DEFAULT_ID_MIN = 1;
const DEFAULT_ID_MAX = 10000;

export class Generator {
  
  public generateMockData(interfaceInfo: InterfaceInfo, count: number = 1): unknown[] {
    const mockData: unknown[] = [];
    
    for (let i = 0; i < count; i++) {
      mockData.push(this.generateObject(interfaceInfo.properties));
    }
    
    return mockData;
  }

  private generateObject(properties: PropertyInfo[]): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    
    for (const property of properties) {
      if (property.isOptional && Math.random() > OPTIONAL_PROPERTY_CHANCE) {
        continue;
      }
      
      result[property.name] = this.generateValue(property);
    }
    
    return result;
  }

  private generateValue(property: PropertyInfo): unknown {
    if (property.type === 'stringLiteralUnion' && property.literalValues) {
      return faker.helpers.arrayElement(property.literalValues);
    }

    if (property.literalValue) {
      return property.literalValue;
    }

    switch (property.type) {
      case 'string':
        return this.generateString(property);
      
      case 'number':
        return this.generateNumber(property);
      
      case 'boolean':
        return faker.datatype.boolean();
      
      case 'date':
        return faker.date.recent().toISOString();
      
      case 'array':
        return this.generateArray(property);
      
      case 'object':
        return this.generateObject(property.properties || []);
      
      case 'union':
        if (property.unionTypes && property.unionTypes.length > 0) {
          const selectedType = faker.helpers.arrayElement(property.unionTypes);
          return this.generateValue(selectedType);
        }
        return null;
      
      case 'any':
        return this.generateAnyValue();
      
      default:
        return null;
    }
  }

  private generateString(property: PropertyInfo): string {
    const name = property.name.toLowerCase();
    
    if (name.includes('email')) return faker.internet.email();
    if (name.includes('name')) return faker.person.fullName();
    if (name.includes('phone')) return faker.phone.number();
    if (name.includes('address')) return faker.location.streetAddress();
    if (name.includes('city')) return faker.location.city();
    if (name.includes('country')) return faker.location.country();
    if (name.includes('url')) return faker.internet.url();
    if (name.includes('id')) return faker.string.alphanumeric(8);
    
    return faker.string.sample();
  }

  private generateNumber(property: PropertyInfo): number {
    const name = property.name.toLowerCase();
    
    if (name.includes('id')) return faker.number.int({ min: DEFAULT_ID_MIN, max: DEFAULT_ID_MAX });
    if (name.includes('age')) return faker.number.int({ min: DEFAULT_AGE_MIN, max: DEFAULT_AGE_MAX });
    if (name.includes('price')) return parseFloat(faker.commerce.price());
    if (name.includes('rating')) return faker.number.float({ min: 1, max: 5, fractionDigits: 1 });
    
    return faker.number.int({ min: 1, max: 1000 });
  }

  private generateArray(property: PropertyInfo): unknown[] {
    if (!property.elementType) return [];
    
    const length = faker.number.int({ min: DEFAULT_ARRAY_MIN_LENGTH, max: DEFAULT_ARRAY_MAX_LENGTH });
    const array: unknown[] = [];
    
    for (let i = 0; i < length; i++) {
      array.push(this.generateValue(property.elementType));
    }
    
    return array;
  }

  private generateAnyValue(): unknown {
    const generators = [
      () => faker.string.sample(),
      () => faker.number.int(),
      () => faker.datatype.boolean(),
      () => faker.date.recent().toISOString(),
      () => ({}),
      () => [],
    ];
    
    const generator = faker.helpers.arrayElement(generators);
    return generator();
  }

  public formatOutput(data: unknown[], format: OutputFormat): string {
    if (format === 'json') {
      return JSON.stringify(data, null, 2);
    } else if (format === 'csv') {
      return stringify(this.flattenData(data), { header: true });
    }
    
    throw new Error(`Unsupported output format: ${format}`);
  }

  private flattenData(data: unknown[]): Record<string, string>[] {
    return data.map(item => this.flattenObject(item as Record<string, unknown>));
  }

  private flattenObject(obj: Record<string, unknown>, prefix: string = ''): Record<string, string> {
    const result: Record<string, string> = {};
    
    for (const [key, value] of Object.entries(obj)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (value === null || value === undefined) {
        result[newKey] = '';
      } else if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length > 0) {
        const nestedObj = this.flattenObject(value as Record<string, unknown>, newKey);
        Object.assign(result, nestedObj);
      } else {
        result[newKey] = this.valueToString(value);
      }
    }
    
    return result;
  }
  
  private valueToString(value: unknown): string {
    if (value === null || value === undefined) {
      return '';
    } else if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return value.map(item => this.valueToString(item)).join(', ');
      } else {
        return JSON.stringify(value);
      }
    } else {
      return String(value);
    }
  }
} 