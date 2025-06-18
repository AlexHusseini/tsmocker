export type OutputFormat = 'json' | 'csv';

export interface CommandOptions {
  schema: string;
  interface: string;
  count: string;
  output: string;
  outFile?: string;
}

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

export interface PropertyInfo {
  name: string;
  type: TypeKind;
  isOptional: boolean;
  elementType?: PropertyInfo;
  properties?: PropertyInfo[];
  unionTypes?: PropertyInfo[];
  literalValues?: string[];
  literalValue?: string;
}

export interface InterfaceInfo {
  name: string;
  properties: PropertyInfo[];
} 