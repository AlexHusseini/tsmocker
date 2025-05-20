export interface GameItem {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'potion' | 'accessory';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  level: number;
  price: number;
  description: string;
  stats: {
    damage?: number;
    defense?: number;
    healing?: number;
    durability: number;
  };
  requirements: {
    minLevel: number;
    class?: ('warrior' | 'mage' | 'rogue')[];
    reputation?: number;
  };
  effects: {
    name: string;
    duration: number;
    power: number;
  }[];
  isStackable: boolean;
  maxStack: number;
  isTradeable: boolean;
  createdAt: Date;
} 