import { useState, useEffect } from 'react';
import { analyticsService } from '../api/analyticsService';
import { useAuth } from '../../auth';
import { UserPerformanceData } from '../types';

interface UseUserPerformanceResult {
  userPerformance: UserPerformanceData[];
  loading: boolean;
  error: string | null;
}

export const useUserPerformance = (startDate?: string, endDate?: string): UseUserPerformanceResult => {
  const [userPerformance, setUserPerformance] = useState<UserPerformanceData[]>([]);
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
          const userPerf = await analyticsService.getUserPerformance(token, 5, startDate, endDate);
          setUserPerformance(userPerf);
        } catch (err) {
          setError('Failed to fetch user performance data.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else {
        // If only one date is provided, do not fetch, show default (empty) data
        setUserPerformance([]);
        setLoading(false);
      }
    };

    fetchData();
  }, [token, startDate, endDate]);

  return {
    userPerformance,
    loading,
    error,
  };
};
