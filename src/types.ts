/**
 * Output format options
 */
export type OutputFormat = 'json' | 'csv';

/**
 * CLI options interface
 */
export interface CommandOptions {
  schema: string;
  interface: string;
  count: number;
  output: OutputFormat;
  outFile?: string;
}

/**
 * Type information from parsed interfaces
 */
export type TypeKind = 
  | 'string'
  | 'number'
  | 'boolean'
  | 'array'
  | 'object'
  | 'union'
  | 'stringLiteralUnion'
  | 'date'
  | 'any'
  | 'unknown';

/**
 * Property information from an interface
 */
export interface PropertyInfo {
  name: string;
  type: TypeKind;
  isOptional: boolean;
  elementType?: PropertyInfo; // For arrays
  properties?: PropertyInfo[]; // For objects
  unionTypes?: PropertyInfo[]; // For unions
  literalValues?: string[]; // For string literal unions
  literalValue?: string; // For individual string literals
}

/**
 * Interface information
 */
export interface InterfaceInfo {
  name: string;
  properties: PropertyInfo[];
} 