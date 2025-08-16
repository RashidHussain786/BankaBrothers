import React, { useState } from 'react';
import { useTopProducts } from '../hooks/useTopProducts';
import DateRangeFilter from '../../shared/components/DateRangeFilter';

interface TopSellingProductsTableProps {
  // No props needed here, as it will manage its own dates
}

const TopSellingProductsTable: React.FC<TopSellingProductsTableProps> = () => {
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);

  const { topProducts, loading, error } = useTopProducts(startDate, endDate);

  const colSpan = 5; // Number of columns in the table

  const handleDateRangeChange = (newStartDate?: string, newEndDate?: string) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Top 5 Best-Selling Products</h2>
        <DateRangeFilter onDateRangeChange={handleDateRangeChange} />
      </div>
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity Sold</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Revenue</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={colSpan} className="px-6 py-4 text-center text-sm text-gray-500 font-medium">
                    Loading top products...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={colSpan} className="px-6 py-4 text-center text-sm text-red-500 font-medium">
                    Error: {error}
                  </td>
                </tr>
              ) : topProducts.length > 0 ? (
                topProducts.map((product) => (
                  <tr key={product.productId} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.productName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.company}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.totalQuantitySold}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.totalRevenue.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={colSpan} className="px-6 py-4 text-center text-sm text-gray-500 font-medium">
                    No top-selling product data available.
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

export default React.memo(TopSellingProductsTable);
