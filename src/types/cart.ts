import { Product } from './product';

export interface CartItem extends Product {
  quantity: number;
  note?: string;
  itemsPerPack: number;
}