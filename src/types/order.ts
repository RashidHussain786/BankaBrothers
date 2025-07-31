export interface CustomerDetails {
  name: string;
  mobile: string;
  address?: string;
  shopName?: string;
  deliveryTime?: string;
  additionalNote?: string;
}

export interface OrderItemPayload {
  productId: number;
  quantity: number;
  priceAtOrder?: number;
  itemsPerPack?: string;
  specialInstructions?: string;
}

export interface OrderData {
  userId: number;
  customerId: number;
  cartItems: OrderItemPayload[];
}

// Updated Order interface to reflect the relational database structure
export interface Order {
  orderId: number;
  userId: number;
  customerId: number;
  createdAt: string;
  status: 'pending' | 'completed';
  user?: any;
  customer?: CustomerDetails;
  orderItems?: Array<{
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    priceAtOrder: number;
    itemsPerPack?: string;
    specialInstructions?: string;
    product?: any;
  }>;
}
