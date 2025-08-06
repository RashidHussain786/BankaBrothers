import React from 'react';
import { useSalesData } from '../hooks/useSalesData';
import SalesOverviewCharts from '../components/SalesOverviewCharts';
import TopSellingProductsTable from '../components/TopSellingProductsTable';
import UserPerformanceTable from '../components/UserPerformanceTable';
import CustomerInsightsTable from '../components/CustomerInsightsTable';

const AnalyticsDashboardPage: React.FC = () => {
  const { salesData, loading: salesLoading, error: salesError } = useSalesData();



  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Sales Analytics Dashboard</h1>

      <SalesOverviewCharts salesData={salesData} loading={salesLoading} error={salesError} />

      <TopSellingProductsTable />

      <UserPerformanceTable />

      <CustomerInsightsTable />
    </div>
  );
};

export default AnalyticsDashboardPage;