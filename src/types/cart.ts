import { Product } from './product';

export interface CartItem extends Product {
  quantity: number;
  itemsPerPack?: string;
  specialInstructions?: string;
}