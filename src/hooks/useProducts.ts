import { useState, useEffect, useMemo } from 'react';

interface Product {
  id: number;
  name: string;
  company: string;
  category: string;
  unitSize: string;
  stock: number;
  image: string;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/products.json');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
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