import { Project, SourceFile, InterfaceDeclaration, PropertySignature, Type, ScriptTarget, ModuleKind } from 'ts-morph';
import path from 'path';
import { InterfaceInfo, PropertyInfo, TypeKind } from './types';

/**
 * TypeScript interface parser that extracts type information
 */
export class Parser {
  private project: Project;

  constructor() {
    this.project = new Project({
      compilerOptions: {
        target: ScriptTarget.ES2020,
        module: ModuleKind.CommonJS,
        strict: true,
      },
    });
  }

  /**
   * Parse a TypeScript file and extract interface information
   */
  public parseFile(filePath: string, interfaceName: string): InterfaceInfo {
    const absolutePath = path.resolve(process.cwd(), filePath);
    const sourceFile = this.project.addSourceFileAtPath(absolutePath);
    
    const interfaceDeclaration = this.findInterface(sourceFile, interfaceName);
    
    if (!interfaceDeclaration) {
      throw new Error(`Interface "${interfaceName}" not found in ${filePath}`);
    }
    
    return this.parseInterface(interfaceDeclaration);
  }

  /**
   * Find an interface declaration by name
   */
  private findInterface(sourceFile: SourceFile, interfaceName: string): InterfaceDeclaration | undefined {
    return sourceFile.getInterfaces().find(i => i.getName() === interfaceName);
  }

  /**
   * Parse an interface declaration into InterfaceInfo
   */
  private parseInterface(interfaceDeclaration: InterfaceDeclaration): InterfaceInfo {
    const properties = interfaceDeclaration.getProperties().map(prop => this.parseProperty(prop));
    
    return {
      name: interfaceDeclaration.getName() || 'Unknown',
      properties,
    };
  }

  /**
   * Parse a property signature into PropertyInfo
   */
  private parseProperty(property: PropertySignature): PropertyInfo {
    const name = property.getName();
    const isOptional = property.hasQuestionToken();
    const type = property.getType();
    
    return {
      name,
      type: this.getTypeKind(type),
      isOptional,
      ...this.parseTypeDetails(type),
    };
  }

  /**
   * Determine the type kind from a TypeScript Type
   */
  private getTypeKind(type: Type): TypeKind {
    if (type.isString() || type.isStringLiteral()) {
      return 'string';
    } else if (type.isNumber() || type.isNumberLiteral()) {
      return 'number';
    } else if (type.isBoolean() || type.isBooleanLiteral()) {
      return 'boolean';
    } else if (type.isArray()) {
      return 'array';
    } else if (type.isObject() && !type.isArray()) {
      return 'object';
    } else if (type.isUnion()) {
      // Check if this is a string literal union
      const unionTypes = type.getUnionTypes();
      const isStringLiteralUnion = unionTypes.every(t => t.isStringLiteral());
      
      if (isStringLiteralUnion) {
        return 'stringLiteralUnion';
      }
      
      return 'union';
    } else if (type.getText().toLowerCase().includes('date')) {
      return 'date';
    } else if (type.isAny()) {
      return 'any';
    } else {
      return 'unknown';
    }
  }

  /**
   * Parse additional type details for complex types
   */
  private parseTypeDetails(type: Type): Partial<PropertyInfo> {
    if (type.isArray()) {
      const elementType = type.getArrayElementType();
      if (elementType) {
        return {
          elementType: {
            name: 'element',
            type: this.getTypeKind(elementType),
            isOptional: false,
            ...this.parseTypeDetails(elementType),
          },
        };
      }
    }
    
    else if (type.isObject() && !type.isArray()) {
      const properties: PropertyInfo[] = [];
      
      // Try to extract properties from the object type
      try {
        // Get properties from the type itself
        const objectProperties = type.getProperties();
        
        if (objectProperties && objectProperties.length > 0) {
          for (const prop of objectProperties) {
            const propName = prop.getName();
            const propType = prop.getValueDeclaration()?.getType() || prop.getTypeAtLocation(prop.getValueDeclaration()!);
            
            if (propType) {
              const isOptional = prop.isOptional();
              
              properties.push({
                name: propName,
                type: this.getTypeKind(propType),
                isOptional,
                ...this.parseTypeDetails(propType),
              });
            }
          }
        }
      } catch (error) {
        // Fallback to symbol-based extraction if the direct approach fails
        const symbol = type.getSymbol();
        if (symbol) {
          const declarations = symbol.getDeclarations();
          if (declarations && declarations.length > 0) {
            const declaration = declarations[0];
            if (declaration.getKind() === 157) { // InterfaceDeclaration
              const interfaceDeclaration = declaration as any;
              if (interfaceDeclaration.getProperties) {
                interfaceDeclaration.getProperties().forEach((prop: PropertySignature) => {
                  properties.push(this.parseProperty(prop));
                });
              }
            }
          }
        }
      }
      
      if (properties.length > 0) {
        return { properties };
      }
    }
    
    else if (type.isUnion()) {
      const unionTypes = type.getUnionTypes();
      
      // Check if it's a string literal union type for special handling
      const isStringLiteralUnion = unionTypes.every(t => t.isStringLiteral());
      
      if (isStringLiteralUnion) {
        const literalValues = unionTypes.map(t => t.getLiteralValueOrThrow().toString());
        return { literalValues };
      } else {
        // Regular union type handling
        const unionTypeInfos = unionTypes.map(unionType => ({
          name: 'option',
          type: this.getTypeKind(unionType),
          isOptional: false,
          ...this.parseTypeDetails(unionType),
        }));
        
        return { unionTypes: unionTypeInfos };
      }
    }
    
    // Handle string literals
    else if (type.isStringLiteral()) {
      return { literalValue: type.getLiteralValueOrThrow().toString() };
    }
    
    return {};
  }
} 