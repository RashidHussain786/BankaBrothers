import { CartItem } from './cart';

export interface CustomerInfo {
  name: string;
  mobile: string;
  address: string;
  deliveryTime?: string;
  additionalNote?: string;
}

export interface OrderData {
  customerInfo: CustomerInfo;
  cartItems: Array<Pick<CartItem, 'id' | 'name' | 'quantity' | 'unitSize' | 'itemsPerPack' | 'note'>>;
}