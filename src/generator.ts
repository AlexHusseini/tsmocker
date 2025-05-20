import { faker } from '@faker-js/faker';
import { stringify } from 'csv-stringify/sync';
import { InterfaceInfo, PropertyInfo, TypeKind, OutputFormat } from './types';

/**
 * Generates mock data based on parsed TypeScript interface information
 */
export class Generator {
  /**
   * Generate mock data for the given interface
   */
  public generateMockData(interfaceInfo: InterfaceInfo, count: number = 1): unknown[] {
    const mockData: unknown[] = [];
    
    for (let i = 0; i < count; i++) {
      mockData.push(this.generateObject(interfaceInfo.properties));
    }
    
    return mockData;
  }

  /**
   * Generate data for an object (set of properties)
   */
  private generateObject(properties: PropertyInfo[]): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    
    for (const property of properties) {
      // Skip optional properties randomly
      if (property.isOptional && Math.random() > 0.7) {
        continue;
      }
      
      result[property.name] = this.generatePropertyValue(property);
    }
    
    return result;
  }

  /**
   * Generate a value for a specific property
   */
  private generatePropertyValue(property: PropertyInfo): unknown {
    // Use more contextual data based on property name
    const name = property.name.toLowerCase();
    
    // Handle special case for string literal unions
    if (property.type === 'stringLiteralUnion' && property.literalValues && property.literalValues.length > 0) {
      return faker.helpers.arrayElement(property.literalValues);
    }

    // Handle individual string literal
    if (property.literalValue) {
      return property.literalValue;
    }
    
    // Special handling for role property which is likely an enum
    if (name === 'role') {
      return faker.helpers.arrayElement(['admin', 'user', 'guest']);
    }

    switch (property.type as TypeKind) {
      case 'string':
        // Generate more meaningful values based on property name
        if (name.includes('email')) {
          return faker.internet.email();
        } else if (name.includes('name')) {
          if (name.includes('first')) {
            return faker.person.firstName();
          } else if (name.includes('last')) {
            return faker.person.lastName();
          } else if (name.includes('user')) {
            return faker.internet.userName();
          } else {
            return faker.person.fullName();
          }
        } else if (name.includes('phone')) {
          return faker.phone.number();
        } else if (name.includes('address') || name.includes('street')) {
          return faker.location.streetAddress();
        } else if (name.includes('city')) {
          return faker.location.city();
        } else if (name.includes('state')) {
          return faker.location.state();
        } else if (name.includes('zip') || name.includes('postal')) {
          return faker.location.zipCode();
        } else if (name.includes('country')) {
          return faker.location.country();
        } else if (name.includes('url') || name.includes('website')) {
          return faker.internet.url();
        } else if (name.includes('image') || name.includes('avatar') || name.includes('photo')) {
          return faker.image.url();
        } else if (name.includes('color')) {
          return faker.color.rgb();
        } else if (name.includes('description') || name.includes('summary')) {
          return faker.lorem.paragraph();
        } else if (name.includes('title')) {
          return faker.lorem.sentence();
        } else if (name.includes('id') && !name.includes('user')) {
          // Generate ID-like string if it's just "id"
          return faker.string.alphanumeric(10);
        } else if (name.includes('comment')) {
          return faker.lorem.paragraph(2);
        } else if (name.includes('sku')) {
          return faker.string.alphanumeric(8).toUpperCase();
        } else {
          return faker.string.sample();
        }
      
      case 'number':
        if (name.includes('id')) {
          return faker.number.int({ min: 1, max: 10000 });
        } else if (name.includes('age')) {
          return faker.number.int({ min: 18, max: 90 });
        } else if (name.includes('price') || name.includes('amount')) {
          return parseFloat(faker.commerce.price());
        } else if (name.includes('year')) {
          return faker.number.int({ min: 1970, max: 2023 });
        } else if (name.includes('stock') || name.includes('quantity')) {
          return faker.number.int({ min: 0, max: 100 });
        } else if (name.includes('rating') || name.includes('average')) {
          return faker.number.float({ min: 1, max: 5, fractionDigits: 1 });
        } else if (name.includes('count')) {
          return faker.number.int({ min: 1, max: 500 });
        } else if (name.includes('width') || name.includes('height') || name.includes('depth')) {
          return faker.number.float({ min: 1, max: 100, fractionDigits: 1 });
        } else if (name.includes('weight') || name.includes('value')) {
          return faker.number.float({ min: 0.1, max: 20, fractionDigits: 2 });
        } else {
          return faker.number.float({ min: 1, max: 1000, fractionDigits: 2 });
        }
      
      case 'boolean':
        return faker.datatype.boolean();
      
      case 'date':
        if (name.includes('birth')) {
          return faker.date.birthdate().toISOString();
        } else if (name.includes('created')) {
          return faker.date.past().toISOString();
        } else if (name.includes('updated')) {
          return faker.date.recent().toISOString();
        } else if (name.includes('future') || name.includes('due')) {
          return faker.date.future().toISOString();
        } else if (name.includes('time') || name === 'lastlogin') {
          return faker.date.recent().toISOString();
        } else {
          return faker.date.recent().toISOString();
        }
      
      case 'array':
        if (property.elementType) {
          const arrayLength = faker.number.int({ min: 1, max: 5 });
          const array: unknown[] = [];
          
          // Special handling for common array types
          if (name === 'phonenumbers' || name.includes('phone')) {
            return Array.from({ length: arrayLength }, () => faker.phone.number());
          } else if (name === 'tags' || name.includes('tag') || name.includes('categories') || name.includes('keywords')) {
            return Array.from({ length: arrayLength }, () => faker.word.sample());
          } else if (name.includes('email')) {
            return Array.from({ length: arrayLength }, () => faker.internet.email());
          } else if (name.includes('url') || name.includes('link')) {
            return Array.from({ length: arrayLength }, () => faker.internet.url());
          } else if (name.includes('materials')) {
            return Array.from({ length: arrayLength }, () => faker.commerce.productMaterial());
          } else {
            // Default array generation - recursively generate each element based on the element type
            for (let i = 0; i < arrayLength; i++) {
              array.push(this.generatePropertyValue(property.elementType));
            }
            return array;
          }
        }
        return [];
      
      case 'object':
        // Handle common object types by name
        if (name === 'address') {
          return {
            street: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state(),
            zipCode: faker.location.zipCode(),
            country: faker.location.country(),
          };
        } else if (name.includes('profile') || name === 'socialprofiles') {
          return {
            twitter: faker.internet.userName(),
            facebook: faker.internet.userName(),
            instagram: faker.internet.userName(),
            linkedin: faker.internet.userName(),
          };
        } else if (name === 'settings') {
          return {
            theme: faker.helpers.arrayElement(['light', 'dark', 'system']),
            notifications: faker.datatype.boolean(),
            language: faker.helpers.arrayElement(['en', 'es', 'fr', 'de', 'zh']),
          };
        } else if (name === 'dimensions') {
          return {
            width: faker.number.float({ min: 10, max: 100, fractionDigits: 1 }),
            height: faker.number.float({ min: 10, max: 100, fractionDigits: 1 }),
            depth: faker.number.float({ min: 10, max: 100, fractionDigits: 1 }),
            unit: faker.helpers.arrayElement(['cm', 'inch']),
          };
        } else if (name === 'weight') {
          return {
            value: faker.number.float({ min: 0.1, max: 20, fractionDigits: 2 }),
            unit: faker.helpers.arrayElement(['kg', 'lb']),
          };
        } else if (name === 'seo') {
          return {
            title: faker.lorem.sentence(),
            description: faker.lorem.paragraph(),
            keywords: Array.from({ length: faker.number.int({ min: 3, max: 7 }) }, () => faker.word.sample()),
          };
        } else if (name === 'ratings') {
          const reviewCount = faker.number.int({ min: 1, max: 5 });
          return {
            average: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
            count: reviewCount,
            reviews: Array.from({ length: reviewCount }, () => ({
              userId: faker.string.uuid(),
              rating: faker.number.int({ min: 1, max: 5 }),
              comment: faker.lorem.paragraph(),
              date: faker.date.recent().toISOString(),
              verified: faker.datatype.boolean(),
            })),
          };
        } else if (name === 'specifications') {
          return {
            dimensions: {
              width: faker.number.float({ min: 10, max: 100, fractionDigits: 1 }),
              height: faker.number.float({ min: 10, max: 100, fractionDigits: 1 }),
              depth: faker.number.float({ min: 5, max: 50, fractionDigits: 1 }),
              unit: faker.helpers.arrayElement(['cm', 'inch']),
            },
            weight: {
              value: faker.number.float({ min: 0.1, max: 20, fractionDigits: 2 }),
              unit: faker.helpers.arrayElement(['kg', 'lb']),
            },
            materials: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => faker.commerce.productMaterial()),
            color: faker.color.human(),
          };
        } else if (property.properties && property.properties.length > 0) {
          // If we have parsed properties, generate object recursively
          return this.generateObject(property.properties);
        }
        
        // Default empty object with some random metadata
        if (name === 'metadata') {
          const metaCount = faker.number.int({ min: 1, max: 3 });
          const result: Record<string, unknown> = {};
          for (let i = 0; i < metaCount; i++) {
            const key = faker.word.sample();
            result[key] = faker.helpers.arrayElement([
              faker.string.sample(),
              faker.number.int(),
              faker.datatype.boolean(),
            ]);
          }
          return result;
        } else if (name.includes('attributes')) {
          const attrCount = faker.number.int({ min: 1, max: 5 });
          const result: Record<string, string> = {};
          for (let i = 0; i < attrCount; i++) {
            const key = faker.commerce.product();
            result[key] = faker.commerce.productMaterial();
          }
          return result;
        }
        
        // Return an empty object if we can't determine the structure
        return {};
      
      case 'union':
        if (property.unionTypes && property.unionTypes.length > 0) {
          // Randomly select one of the union types
          const selectedType = faker.helpers.arrayElement(property.unionTypes);
          return this.generatePropertyValue(selectedType);
        }
        return null;
      
      case 'stringLiteralUnion':
        if (property.literalValues && property.literalValues.length > 0) {
          return faker.helpers.arrayElement(property.literalValues);
        }
        return null;
        
      case 'any':
        // For any, randomly generate one of multiple types
        const anyTypeGenerators = [
          () => faker.string.sample(),
          () => faker.number.int(),
          () => faker.datatype.boolean(),
          () => faker.date.recent().toISOString(),
          () => ({}),
          () => [],
        ];
        const randomGenerator = faker.helpers.arrayElement(anyTypeGenerators);
        return randomGenerator();
      
      case 'unknown':
      default:
        return null;
    }
  }

  /**
   * Format the mock data as JSON or CSV
   */
  public formatOutput(data: unknown[], format: OutputFormat): string {
    if (format === 'json') {
      return JSON.stringify(data, null, 2);
    } else if (format === 'csv') {
      // For CSV, we need to flatten the data
      return stringify(this.flattenData(data), {
        header: true,
      });
    }
    
    throw new Error(`Unsupported output format: ${format}`);
  }

  /**
   * Flatten nested objects for CSV output
   */
  private flattenData(data: unknown[]): Record<string, string>[] {
    return data.map(item => this.flattenObject(item as Record<string, unknown>));
  }

  /**
   * Recursively flatten an object for CSV output
   */
  private flattenObject(obj: Record<string, unknown>, prefix: string = ''): Record<string, string> {
    const result: Record<string, string> = {};
    
    for (const [key, value] of Object.entries(obj)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (value === null || value === undefined) {
        result[newKey] = '';
      } else if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length > 0) {
        // Recursive case for nested objects
        const nestedObj = this.flattenObject(value as Record<string, unknown>, newKey);
        Object.assign(result, nestedObj);
      } else {
        result[newKey] = this.valueToString(value);
      }
    }
    
    return result;
  }
  
  /**
   * Convert any value to a string representation for CSV
   */
  private valueToString(value: unknown): string {
    if (value === null || value === undefined) {
      return '';
    } else if (typeof value === 'object') {
      if (value instanceof Date) {
        return value.toISOString();
      } else if (Array.isArray(value)) {
        return value.map(item => this.valueToString(item)).join(', ');
      } else {
        return JSON.stringify(value);
      }
    } else {
      return String(value);
    }
  }
} 