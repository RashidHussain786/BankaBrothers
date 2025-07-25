import { Product } from '../types';

export const productService = {
  async getProducts(): Promise<Product[]> {
    const response = await fetch('/products.json');
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return response.json();
  },
};
