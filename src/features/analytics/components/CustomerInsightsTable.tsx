import React, { useState } from 'react';
import { useCustomerInsights } from '../hooks/useCustomerInsights';
import DateRangeFilter from '../../shared/components/DateRangeFilter';

interface CustomerInsightsTableProps {
  // No props needed here, as it will manage its own dates
}

const CustomerInsightsTable: React.FC<CustomerInsightsTableProps> = () => {
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);

  const { customerInsights, loading, error } = useCustomerInsights(startDate, endDate);

  const colSpan = 5; // Number of columns in the table

  const handleDateRangeChange = (newStartDate?: string, newEndDate?: string) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Top 5 Customers</h2>
        <DateRangeFilter onDateRangeChange={handleDateRangeChange} />
      </div>
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shop Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Revenue</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={colSpan} className="px-6 py-4 text-center text-sm text-gray-500 font-medium">
                    Loading customer insights...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={colSpan} className="px-6 py-4 text-center text-sm text-red-500 font-medium">
                    Error: {error}
                  </td>
                </tr>
              ) : customerInsights.length > 0 ? (
                customerInsights.map((customer) => (
                  <tr key={customer.customerId} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.shopName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.mobile}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.totalOrders}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${customer.totalRevenue.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={colSpan} className="px-6 py-4 text-center text-sm text-gray-500 font-medium">
                    No customer insights data available.
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

export default React.memo(CustomerInsightsTable);
