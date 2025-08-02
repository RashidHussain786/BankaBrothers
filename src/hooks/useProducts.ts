import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/productService';
import { ProductQueryParams } from '../types';

export const useProducts = (params: ProductQueryParams) => {
  const queryClient = useQueryClient();

  // Fetch Products
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['products', params],
    queryFn: () => productService.getProducts(params),
    placeholderData: (previousData) => previousData,
  });

  // Add Product
  const addMutation = useMutation({
    mutationFn: productService.addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  // Update Product
  const updateMutation = useMutation({
    mutationFn: productService.updateProduct,
    onSuccess: (updatedProduct) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', updatedProduct.id] });
    },
  });

  // Delete Product
  const deleteMutation = useMutation({
    mutationFn: (productId: number) => productService.deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return {
    products: data?.data || [],
    totalCount: data?.totalCount || 0,
    loading: isLoading,
    error: isError ? (error as Error).message : null,

    // Expose mutations
    addProduct: addMutation.mutate,
    updateProduct: updateMutation.mutate,
    deleteProduct: deleteMutation.mutate,

    // Optional: expose mutation states if needed
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};