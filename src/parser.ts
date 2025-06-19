import { Project, SourceFile, InterfaceDeclaration, PropertySignature, Type, ScriptTarget, ModuleKind } from 'ts-morph';
import path from 'path';
import { InterfaceInfo, PropertyInfo, TypeKind } from './types';

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

  public getProject(): Project {
    return this.project;
  }

  public parseFile(filePath: string, interfaceName: string): InterfaceInfo {
    const absolutePath = path.resolve(process.cwd(), filePath);
    const sourceFile = this.project.addSourceFileAtPath(absolutePath);
    
    const interfaceDeclaration = this.findInterface(sourceFile, interfaceName);
    
    if (!interfaceDeclaration) {
      throw new Error(`Interface "${interfaceName}" not found in ${filePath}`);
    }
    
    return this.parseInterface(interfaceDeclaration);
  }

  private findInterface(sourceFile: SourceFile, interfaceName: string): InterfaceDeclaration | undefined {
    return sourceFile.getInterfaces().find(i => i.getName() === interfaceName);
  }

  private parseInterface(interfaceDeclaration: InterfaceDeclaration): InterfaceInfo {
    const properties = interfaceDeclaration.getProperties().map(prop => this.parseProperty(prop));
    
    return {
      name: interfaceDeclaration.getName() || 'Unknown',
      properties,
    };
  }

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

  private getTypeKind(type: Type): TypeKind {
    if (type.isString() || type.isStringLiteral()) {
      return 'string';
    } else if (type.isNumber() || type.isNumberLiteral()) {
      return 'number';
    } else if (type.isBoolean() || type.isBooleanLiteral()) {
      return 'boolean';
    } else if (type.isArray()) {
      return 'array';
    } else if (this.isDateType(type)) {
      return 'date';
    } else if (type.isObject() && !type.isArray()) {
      return 'object';
    } else if (type.isUnion()) {
      return this.isStringLiteralUnion(type) ? 'stringLiteralUnion' : 'union';
    } else if (type.isAny()) {
      return 'any';
    } else {
      return 'unknown';
    }
  }

  private isDateType(type: Type): boolean {
    return (
      (type.isClass() && type.getSymbol()?.getName() === 'Date') ||
      type.getText().toLowerCase().includes('date')
    );
  }

  private isStringLiteralUnion(type: Type): boolean {
    const unionTypes = type.getUnionTypes();
    return unionTypes.every(t => t.isStringLiteral());
  }

  private parseTypeDetails(type: Type): Partial<PropertyInfo> {
    // Handle different type structures and extract additional metadata
    if (type.isArray()) {
      return this.parseArrayType(type);
    } else if (type.isObject() && !type.isArray()) {
      return this.parseObjectType(type);
    } else if (type.isUnion()) {
      return this.parseUnionType(type);
    } else if (type.isStringLiteral()) {
      return { literalValue: type.getLiteralValueOrThrow().toString() };
    }
    
    // No additional details needed for simple types
    return {};
  }

  private parseArrayType(type: Type): Partial<PropertyInfo> {
    const elementType = type.getArrayElementType();
    if (!elementType) return {};

    return {
      elementType: {
        name: 'element',
        type: this.getTypeKind(elementType),
        isOptional: false,
        ...this.parseTypeDetails(elementType),
      },
    };
  }

  private parseObjectType(type: Type): Partial<PropertyInfo> {
    try {
      const properties: PropertyInfo[] = [];
      const objectProperties = type.getProperties();
      
      for (const prop of objectProperties) {
        const propName = prop.getName();
        const propType = prop.getValueDeclaration()?.getType() || prop.getTypeAtLocation(prop.getValueDeclaration()!);
        
        if (propType) {
          properties.push({
            name: propName,
            type: this.getTypeKind(propType),
            isOptional: prop.isOptional(),
            ...this.parseTypeDetails(propType),
          });
        }
      }
      
      return properties.length > 0 ? { properties } : {};
    } catch (error) {
      return {};
    }
  }

  private parseUnionType(type: Type): Partial<PropertyInfo> {
    const unionTypes = type.getUnionTypes();
    
    if (this.isStringLiteralUnion(type)) {
      const literalValues = unionTypes.map(t => t.getLiteralValueOrThrow().toString());
      return { literalValues };
    }
    
    const unionTypeInfos = unionTypes.map(unionType => ({
      name: 'option',
      type: this.getTypeKind(unionType),
      isOptional: false,
      ...this.parseTypeDetails(unionType),
    }));
    
    return { unionTypes: unionTypeInfos };
  }
} 