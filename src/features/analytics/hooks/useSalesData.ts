import { useState, useEffect } from 'react';
import { analyticsService } from '../api/analyticsService';
import { useAuth } from '../../auth';
import { SalesData } from '../types';

interface UseSalesDataResult {
  salesData: SalesData[];
  loading: boolean;
  error: string | null;
}

export const useSalesData = (): UseSalesDataResult => {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
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

      try {
        setLoading(true);
        const sales = await analyticsService.getSalesOverview(token);
        setSalesData(sales);
      } catch (err) {
        setError('Failed to fetch sales data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return {
    salesData,
    loading,
    error,
  };
};
