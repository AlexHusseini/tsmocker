// User Profile Interface
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  age: number;
  isActive: boolean;
  role: 'admin' | 'user' | 'guest';
  createdAt: Date;
  lastLogin: Date;
  address: {
    street: string;
    city: string;
    country: string;
    zipCode: string;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    language: 'en' | 'es' | 'fr';
  };
  tags: string[];
  metadata?: {
    lastUpdated: Date;
    version: number;
  };
}

// Product Catalog Interface
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'electronics' | 'clothing' | 'books' | 'food';
  inStock: boolean;
  rating: number;
  tags: string[];
  specifications: {
    weight: number;
    dimensions: {
      width: number;
      height: number;
      depth: number;
    };
    color: string;
  };
  reviews: Array<{
    userId: string;
    rating: number;
    comment: string;
    date: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

// Blog Post Interface
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  categories: string[];
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  comments: Array<{
    id: string;
    userId: string;
    content: string;
    createdAt: Date;
    likes: number;
  }>;
  metadata: {
    views: number;
    likes: number;
    shares: number;
    lastUpdated: Date;
  };
}

// Game Character Interface
export interface GameCharacter {
  id: string;
  name: string;
  class: 'warrior' | 'mage' | 'rogue' | 'priest';
  level: number;
  experience: number;
  health: number;
  mana: number;
  isNPC: boolean;
  stats: {
    strength: number;
    agility: number;
    intelligence: number;
    vitality: number;
  };
  equipment: {
    weapon?: {
      id: string;
      name: string;
      damage: number;
    };
    armor?: {
      id: string;
      name: string;
      defense: number;
    };
  };
  inventory: Array<{
    id: string;
    name: string;
    quantity: number;
    type: 'weapon' | 'armor' | 'potion' | 'scroll';
  }>;
  skills: Array<{
    id: string;
    name: string;
    level: number;
    cooldown: number;
  }>;
  createdAt: Date;
  lastPlayed: Date;
} 