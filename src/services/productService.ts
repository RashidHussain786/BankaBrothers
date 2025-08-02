import { Product, ProductQueryParams, ProductServiceResponse } from '../types';

import { API_BASE_URL } from '../config';

export const productService = {
  async getProducts(params: ProductQueryParams = {}): Promise<ProductServiceResponse> {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.company) query.append('company', params.company);
    if (params.category) query.append('category', params.category);
    if (params.brand) query.append('brand', params.brand);
    if (params.size) query.append('size', params.size);
    if (params.inStockOnly) query.append('inStockOnly', params.inStockOnly.toString());
    if (params.sortColumn) query.append('sortColumn', params.sortColumn);
    if (params.sortDirection) query.append('sortDirection', params.sortDirection);
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());

    const response = await fetch(`${API_BASE_URL}/products?${query.toString()}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    const data = await response.json();
    // Parse price for each variant
    const processedData = {
      ...data,
      data: data.data.map((item: Product) => ({
        ...item,
        variant: {
          ...item.variant,
          price: item.variant.price,
        },
      })),
    };
    return processedData;
  },

  async getCompanies(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/products/companies`);
    if (!response.ok) {
      throw new Error(`Failed to fetch companies: ${response.statusText}`);
    }
    return response.json();
  },

  async getCategories(company?: string): Promise<string[]> {
    const query = new URLSearchParams();
    if (company) query.append('company', company);
    const response = await fetch(`${API_BASE_URL}/products/categories?${query.toString()}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }
    return response.json();
  },

  async getBrands(company?: string, category?: string): Promise<string[]> {
    const query = new URLSearchParams();
    if (company) query.append('company', company);
    if (category) query.append('category', category);
    const response = await fetch(`${API_BASE_URL}/products/brands?${query.toString()}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch brands: ${response.statusText}`);
    }
    return response.json();
  },

  async getSizes(company?: string, category?: string, brand?: string): Promise<string[]> {
    const query = new URLSearchParams();
    if (company) query.append('company', company);
    if (category) query.append('category', category);
    if (brand) query.append('brand', brand);
    const response = await fetch(`${API_BASE_URL}/products/sizes?${query.toString()}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch sizes: ${response.statusText}`);
    }
    return response.json();
  },
  async addProduct(product: Omit<Product, 'id' | 'variant'> & { variant: Omit<Product['variant'], 'id' | 'productId'> }): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error(`Failed to add product: ${response.statusText}`);
    }
    return response.json();
  },

  async updateProduct(product: Product): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/${product.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error(`Failed to update product: ${response.statusText}`);
    }
    return response.json();
  },

  async deleteProduct(productId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete product: ${response.statusText}`);
    }
  },
};
