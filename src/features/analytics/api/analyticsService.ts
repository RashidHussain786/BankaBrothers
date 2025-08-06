import { API_BASE_URL } from "../../../config";

import { CustomerInsightsData, SalesData, TopProductData, UserPerformanceData } from '../types';

export const analyticsService = {
  getSalesOverview: async (token: string): Promise<SalesData[]> => {
    const response = await fetch(`${API_BASE_URL}/analytics/sales-overview`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch sales overview');
    }

    const data = await response.json();
    return data.data;
  },

  getTopSellingProducts: async (token: string, limit: number = 5, startDate?: string, endDate?: string): Promise<TopProductData[]> => {
    let url = `${API_BASE_URL}/analytics/top-selling-products?limit=${limit}`;
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch top selling products');
    }

    const data = await response.json();
    return data.data;
  },

  getUserPerformance: async (token: string, limit: number = 5, startDate?: string, endDate?: string): Promise<UserPerformanceData[]> => {
    let url = `${API_BASE_URL}/analytics/user-performance?limit=${limit}`;
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch user performance');
    }

    const data = await response.json();
    return data.data;
  },

  getCustomerInsights: async (token: string, limit: number = 5, startDate?: string, endDate?: string): Promise<CustomerInsightsData[]> => {
    let url = `${API_BASE_URL}/analytics/customer-insights?limit=${limit}`;
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (params.toString()) url += `&${params.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch customer insights');
    }

    const data = await response.json();
    return data.data;
  },
};
