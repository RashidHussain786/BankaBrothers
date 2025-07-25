import { useState, useEffect, useMemo } from 'react';
import { Product } from '../types';
import { productService } from '../services/productService';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getProducts();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const companies = useMemo(() => {
    return Array.from(new Set(products.map(product => product.company))).sort();
  }, [products]);

  const categories = useMemo(() => {
    return Array.from(new Set(products.map(product => product.category))).sort();
  }, [products]);

  return { products, companies, categories, loading, error };
};