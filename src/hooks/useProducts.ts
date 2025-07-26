import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';
import { ProductQueryParams } from '../types';

export const useProducts = (params: ProductQueryParams) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['products', params],
    queryFn: () => productService.getProducts(params),
    placeholderData: (previousData) => previousData,
  });

  return {
    products: data?.data || [],
    totalCount: data?.totalCount || 0,
    loading: isLoading,
    error: isError ? (error as Error).message : null,
  };
};