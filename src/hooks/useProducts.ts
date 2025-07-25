import { useState, useEffect } from 'react';
import { Product, ProductQueryParams } from '../types';
import { productService } from '../services/productService';

export const useProducts = (params: ProductQueryParams) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [companies, setCompanies] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await productService.getProducts(params);
        setProducts(result.data);
        setTotalCount(result.totalCount);
        setCompanies(result.companies);
        setCategories(result.categories);
        setBrands(result.brands);
        setSizes(result.sizes);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [params]);

  return { products, totalCount, companies, categories, brands, sizes, loading, error };
};