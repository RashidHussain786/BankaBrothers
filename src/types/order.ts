import { CartItem } from './cart';

export interface CustomerInfo {
  name: string;
  mobile: string;
  address: string;
  deliveryTime?: string;
  additionalNote?: string;
}

export interface OrderData {
  userId: number;
  customerInfo: CustomerInfo;
  cartItems: Array<Pick<CartItem, 'id' | 'name' | 'quantity' | 'unitSize' | 'itemsPerPack' | 'note'>>;
}

export interface Order {
  orderId: number;
  userId: number;
  customerInfo: CustomerInfo;
  items: Array<Pick<CartItem, 'id' | 'name' | 'quantity' | 'unitSize' | 'itemsPerPack' | 'note'>>;
  timestamp: string;
  status: 'pending' | 'completed';
}