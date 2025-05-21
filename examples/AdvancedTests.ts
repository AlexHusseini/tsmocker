// 1. Complex Nested Arrays Test
export interface NestedArrayTest {
  id: string;
  name: string;
  matrix: Array<Array<{
    value: number;
    metadata: {
      timestamp: Date;
      tags: string[];
    };
  }>>;
  tree: Array<{
    node: {
      id: string;
      children: Array<{
        id: string;
        value: number;
      }>;
    };
  }>;
}

// 2. Union Types with Objects Test
export interface UnionObjectTest {
  id: string;
  content: {
    type: 'text' | 'image' | 'video';
    data: {
      text?: {
        content: string;
        format: 'plain' | 'markdown' | 'html';
      };
      image?: {
        url: string;
        dimensions: {
          width: number;
          height: number;
        };
      };
      video?: {
        url: string;
        duration: number;
        format: 'mp4' | 'webm' | 'ogg';
      };
    };
  };
}

// 3. Recursive Types Test
export interface RecursiveTest {
  id: string;
  name: string;
  parent?: {
    id: string;
    name: string;
    parent?: {
      id: string;
      name: string;
      parent?: {
        id: string;
        name: string;
      };
    };
  };
  children: Array<{
    id: string;
    name: string;
    children: Array<{
      id: string;
      name: string;
    }>;
  }>;
}

// 4. Generic Types Test
export interface GenericTest<T extends string | number> {
  id: string;
  value: T;
  metadata: {
    type: T;
    timestamp: Date;
    tags: T[];
  };
  items: Array<{
    id: string;
    value: T;
    nested: {
      value: T;
      type: T;
    };
  }>;
}

// 5. Intersection Types Test
export interface IntersectionTest {
  id: string;
  user: {
    id: string;
    name: string;
  } & {
    email: string;
    role: 'admin' | 'user';
  };
  product: {
    id: string;
    name: string;
  } & {
    price: number;
    category: string;
  };
  metadata: {
    created: Date;
    updated: Date;
  } & {
    version: number;
    status: 'active' | 'inactive';
  };
} 