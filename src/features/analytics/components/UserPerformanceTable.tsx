import React, { useState } from 'react';
import { useUserPerformance } from '../hooks/useUserPerformance';
import DateRangeFilter from '../../shared/components/DateRangeFilter';

interface UserPerformanceTableProps {
  // No props needed here, as it will manage its own dates
}

const UserPerformanceTable: React.FC<UserPerformanceTableProps> = () => {
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);

  const { userPerformance, loading, error } = useUserPerformance(startDate, endDate);

  const colSpan = 5; // Number of columns in the table

  const handleDateRangeChange = (newStartDate?: string, newEndDate?: string) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Top 5 Users Performance</h2>
        <div className="flex items-center space-x-2 text-sm">
          <DateRangeFilter onDateRangeChange={handleDateRangeChange} />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products Sold</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unique Customers</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Order Value</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={colSpan} className="px-6 py-4 text-center text-sm text-gray-500 font-medium">
                    Loading user performance...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={colSpan} className="px-6 py-4 text-center text-sm text-red-500 font-medium">
                    Error: {error}
                  </td>
                </tr>
              ) : userPerformance.length > 0 ? (
                userPerformance.map((user) => (
                  <tr key={user.userId} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.totalOrders}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.totalProductsSold}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.uniqueCustomersServed}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${user.averageOrderValue.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={colSpan} className="px-6 py-4 text-center text-sm text-gray-500 font-medium">
                    No user performance data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default React.memo(UserPerformanceTable);
