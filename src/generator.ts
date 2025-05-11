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
    
    // Special handling for role property which is likely an enum
    if (name === 'role') {
      return faker.helpers.arrayElement(['admin', 'user', 'guest']);
    }
    
    // Special handling for date-related properties
    if (name.includes('date') || name.includes('time') || name === 'birthdate' || name === 'lastlogin') {
      return faker.date.recent();
    }

    switch (property.type) {
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
            return faker.internet.username();
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
        } else {
          return faker.number.int({ min: 1, max: 1000 });
        }
      
      case 'boolean':
        return faker.datatype.boolean();
      
      case 'date':
        if (name.includes('birth')) {
          return faker.date.birthdate();
        } else if (name.includes('created')) {
          return faker.date.past();
        } else if (name.includes('updated')) {
          return faker.date.recent();
        } else if (name.includes('future') || name.includes('due')) {
          return faker.date.future();
        } else {
          return faker.date.recent();
        }
      
      case 'array':
        if (property.elementType) {
          const arrayLength = faker.number.int({ min: 1, max: 5 });
          const array: unknown[] = [];
          
          // Special handling for common array types
          if (name === 'phonenumbers' || name.includes('phone')) {
            return Array.from({ length: arrayLength }, () => faker.phone.number());
          } else if (name === 'tags' || name.includes('tag')) {
            return Array.from({ length: arrayLength }, () => faker.word.sample());
          } else if (name.includes('email')) {
            return Array.from({ length: arrayLength }, () => faker.internet.email());
          } else if (name.includes('url') || name.includes('link')) {
            return Array.from({ length: arrayLength }, () => faker.internet.url());
          } else {
            // Default array generation
            for (let i = 0; i < arrayLength; i++) {
              array.push(this.generatePropertyValue(property.elementType));
            }
          }
          
          return array;
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
            twitter: faker.internet.username(),
            facebook: faker.internet.username(),
            instagram: faker.internet.username(),
            linkedin: faker.internet.username(),
          };
        } else if (name === 'settings') {
          return {
            theme: faker.helpers.arrayElement(['light', 'dark', 'system']),
            notifications: faker.datatype.boolean(),
            language: faker.helpers.arrayElement(['en', 'es', 'fr', 'de', 'zh']),
          };
        } else if (property.properties && property.properties.length > 0) {
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
        }
        
        return {};
      
      case 'union':
        if (property.unionTypes && property.unionTypes.length > 0) {
          // Randomly select one of the union types
          const selectedType = faker.helpers.arrayElement(property.unionTypes);
          return this.generatePropertyValue(selectedType);
        }
        return null;
      
      case 'any':
        // For any, randomly generate one of multiple types
        const anyTypeGenerators = [
          () => faker.string.sample(),
          () => faker.number.int(),
          () => faker.datatype.boolean(),
          () => faker.date.recent(),
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
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        Object.assign(result, this.flattenObject(value as Record<string, unknown>, newKey));
      } else {
        result[newKey] = this.valueToString(value);
      }
    }
    
    return result;
  }

  /**
   * Convert a value to a string for CSV output
   */
  private valueToString(value: unknown): string {
    if (value === null || value === undefined) {
      return '';
    }
    
    if (value instanceof Date) {
      return value.toISOString();
    }
    
    if (Array.isArray(value)) {
      return JSON.stringify(value);
    }
    
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    
    return String(value);
  }
} 