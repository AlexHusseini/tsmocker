/**
 * Address data for a user
 */
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
}

/**
 * Role enum for user's role
 */
export enum Role {
  Admin = 'admin',
  User = 'user',
  Guest = 'guest',
}

/**
 * Social media profiles
 */
export interface SocialProfiles {
  twitter?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
}

/**
 * User model with various types
 */
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  isActive: boolean;
  birthDate: Date;
  role: Role;
  lastLogin?: Date;
  address: Address;
  phoneNumbers: string[];
  tags: string[];
  socialProfiles?: SocialProfiles;
  settings: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    language: string;
  };
  metadata: Record<string, any>;
}

/**
 * Simple user for testing
 */
export interface SimpleUser {
  id: number;
  name: string;
  email: string;
  active: boolean;
} 