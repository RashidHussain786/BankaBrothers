import { OrderData } from '../types';

import { API_BASE_URL } from '../config';

export const orderService = {
  async submitOrder(orderData: OrderData) {
    const response = await fetch(`${API_BASE_URL}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Order submission failed');
    }

    const data = await response.json();
    return data;
  },
};