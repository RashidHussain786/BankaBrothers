import { useState, useEffect } from 'react';
import { analyticsService } from '../api/analyticsService';
import { useAuth } from '../../auth';
import { CustomerInsightsData } from '../types';

interface UseCustomerInsightsResult {
  customerInsights: CustomerInsightsData[];
  loading: boolean;
  error: string | null;
}

export const useCustomerInsights = (startDate?: string, endDate?: string): UseCustomerInsightsResult => {
  const [customerInsights, setCustomerInsights] = useState<CustomerInsightsData[]>([]);
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
          const customerIns = await analyticsService.getCustomerInsights(token, 5, startDate, endDate);
          setCustomerInsights(customerIns);
        } catch (err) {
          setError('Failed to fetch customer insights data.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else {
        // If only one date is provided, do not fetch, show default (empty) data
        setCustomerInsights([]);
        setLoading(false);
      }
    };

    fetchData();
  }, [token, startDate, endDate]);

  return {
    customerInsights,
    loading,
    error,
  };
};
