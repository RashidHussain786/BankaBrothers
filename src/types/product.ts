import { SortableColumn, SortDirection } from './sorting';

export interface ProductVariant {
  id: number;
  productId: number;
  unitSize: string;
  price: number;
  stockQuantity: number;
}

export interface Product {
  id: number;
  name: string;
  company?: string;
  category?: string;
  brand?: string;
  variant: ProductVariant;
}

export interface ProductQueryParams {
  search?: string;
  company?: string;
  category?: string;
  brand?: string;
  size?: string;
  inStockOnly?: boolean;
  sortColumn?: SortableColumn | null;
  sortDirection?: SortDirection;
  page?: number;
  limit?: number;
}

export interface ProductServiceResponse {
  data: Product[];
  totalCount: number;
  companies: string[];
  categories: string[];
  brands: string[];
  sizes: string[];
}