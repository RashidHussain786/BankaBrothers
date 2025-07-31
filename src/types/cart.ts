import { Product } from './product';

export interface CartItem extends Product {
  quantity: number;
  itemsPerPack?: string;
  specialInstructions?: string;
  price: number; // Explicitly add price to CartItem
}