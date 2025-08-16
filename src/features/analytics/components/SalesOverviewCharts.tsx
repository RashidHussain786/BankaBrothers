import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { SalesData } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SalesOverviewChartsProps {
  salesData: SalesData[];
  loading: boolean;
  error: string | null;
}

const SalesOverviewCharts: React.FC<SalesOverviewChartsProps> = ({ salesData, loading, error }) => {
  if (loading) return <div className="text-center py-4">Loading sales data...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  const chartLabels = salesData.map((data) => data.date);
  const revenueData = salesData.map((data) => data.totalRevenue);
  const ordersData = salesData.map((data) => data.totalOrders);

  const revenueChartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Total Revenue',
        data: revenueData,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
      },
    ],
  };

  const ordersChartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Total Orders',
        data: ordersData,
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Revenue Over Time</h2>
        {salesData.length > 0 ? <Line data={revenueChartData} /> : <p>No revenue data available.</p>}
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Orders Over Time</h2>
        {salesData.length > 0 ? <Line data={ordersChartData} /> : <p>No order data available.</p>}
      </div>
    </div>
  );
};

export default React.memo(SalesOverviewCharts);
