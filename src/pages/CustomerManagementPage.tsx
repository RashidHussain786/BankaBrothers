import { useState, useEffect } from 'react';
import { Customer } from '../types/customer';
import { getAllCustomers, deleteCustomer } from '../services/customerService';
import AddCustomerModal from '../components/AddCustomerModal';
import EditCustomerModal from '../components/EditCustomerModal';
import Pagination from '../components/Pagination';
import ItemsPerPageSelector from '../components/ItemsPerPageSelector';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const CustomerManagementPage = () => {
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data, isLoading, error } = useQuery<{ customers: Customer[], totalCount: number }, Error>({
    queryKey: ['customers', currentPage, itemsPerPage],
    queryFn: () => getAllCustomers(currentPage, itemsPerPage),
    enabled: true,
  });

  const customers = data?.customers;
  const totalCount = data?.totalCount || 0;

  // Reset current page if itemsPerPage changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  // If current page is empty but there are total results, reset to page 1
  useEffect(() => {
    if (!isLoading && customers && customers.length === 0 && totalCount > 0 && currentPage > 1) {
      setCurrentPage(1);
    }
  }, [customers, totalCount, isLoading, currentPage]);

  // Prefetch next page
  useEffect(() => {
    const totalPages = Math.ceil(totalCount / itemsPerPage);
    const nextPage = currentPage + 1;

    if (nextPage <= totalPages) {
      queryClient.prefetchQuery({
        queryKey: ['customers', nextPage, itemsPerPage],
        queryFn: () => getAllCustomers(nextPage, itemsPerPage),
      });
    }
  }, [currentPage, itemsPerPage, totalCount, queryClient]);

  const handleAddCustomer = () => {
    setIsAddModalOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEditModalOpen(true);
  };

  const handleDeleteCustomer = async (customerId: number) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer(customerId);
        queryClient.invalidateQueries({ queryKey: ['customers', currentPage, itemsPerPage] });
      } catch (error: unknown) {
        console.error('Error deleting customer:', error);
        alert(error instanceof Error ? error.message : 'An unknown error occurred');
      }
    }
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading customers...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Customer Management</h1>
        <div className="flex items-center space-x-4">
          <ItemsPerPageSelector
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
          />
          <button
            onClick={handleAddCustomer}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 shadow-sm"
          >
            Add Customer
          </button>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shop Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers?.map((customer) => (
              <tr key={customer.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.shopName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.address}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.mobile}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEditCustomer(customer)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCustomer(customer.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {customers && customers.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalCount / itemsPerPage)}
          onPageChange={setCurrentPage}
          totalItems={totalCount}
          itemsPerPage={itemsPerPage}
        />
      )}
      {isAddModalOpen && (
        <AddCustomerModal
          onClose={() => setIsAddModalOpen(false)}
          onCustomerAdded={() => queryClient.invalidateQueries({ queryKey: ['customers', currentPage, itemsPerPage] })}
        />
      )}
      {isEditModalOpen && selectedCustomer && (
        <EditCustomerModal
          customer={selectedCustomer}
          onClose={() => setIsEditModalOpen(false)}
          onCustomerUpdated={() => queryClient.invalidateQueries({ queryKey: ['customers', currentPage, itemsPerPage] })}
        />
      )}
    </div>
  );
};

export default CustomerManagementPage;
