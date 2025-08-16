import { useState, useEffect } from 'react';
import { analyticsService } from '../api/analyticsService';
import { useAuth } from '../../auth';
import { TopProductData } from '../types';

interface UseTopProductsResult {
  topProducts: TopProductData[];
  loading: boolean;
  error: string | null;
}

export const useTopProducts = (startDate?: string, endDate?: string): UseTopProductsResult => {
  const [topProducts, setTopProducts] = useState<TopProductData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError('Authentication token not found.');
        setLoading(false);
        return;
      }

      // Only fetch data if both dates are provided, or if neither are provided
      if ((startDate && endDate) || (!startDate && !endDate)) {
        try {
          setLoading(true);
          const top = await analyticsService.getTopSellingProducts(token, 5, startDate, endDate);
          setTopProducts(top);
        } catch (err) {
          setError('Failed to fetch top products data.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else {
        // If only one date is provided, do not fetch, show default (empty) data
        setTopProducts([]);
        setLoading(false);
      }
    };

    fetchData();
  }, [token, startDate, endDate]);

  return {
    topProducts,
    loading,
    error,
  };
};
