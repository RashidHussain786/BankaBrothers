import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../services/adminService';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types/order';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AlertCircle } from 'lucide-react';
import Pagination from '../components/Pagination';
import ItemsPerPageSelector from '../components/ItemsPerPageSelector';

const AdminOrderManagementPage: React.FC = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [notifiedOrderIds, setNotifiedOrderIds] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data, isLoading, error } = useQuery<{ orders: Order[], totalCount: number }, Error>({
    queryKey: ['orders', currentPage, itemsPerPage],
    queryFn: () => adminService.getAllOrders(token!, currentPage, itemsPerPage),
    enabled: !!token,
  });

  const orders = data?.orders;
  const totalCount = data?.totalCount || 0;

  const updateOrderStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: number; status: 'pending' | 'completed' }) =>
      adminService.updateOrderStatus(orderId, status, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update order status: ${error.message}`);
    }
  });

  const handleStatusChange = (orderId: number, currentStatus: 'pending' | 'completed') => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    console.log(`Attempting to update order ${orderId} to status: ${newStatus}`);
    updateOrderStatusMutation.mutate({ orderId, status: newStatus });
  };

  useEffect(() => {
    if (orders) {
      setNotifiedOrderIds(prevNotifiedOrderIds => {
        const newNotifiedOrderIds = new Set(prevNotifiedOrderIds);
        orders.forEach(order => {
          if (order.status === 'pending' && !newNotifiedOrderIds.has(order.orderId)) {
            newNotifiedOrderIds.add(order.orderId);
            if (!toast.isActive(`order-${order.orderId}`)) {
              toast.info(
                <div className="flex flex-col">
                  <p className="font-bold">New Order Received!</p>
                  <p>Order ID: {order.orderId}</p>
                  <p>User ID: {order.userId}</p>
                  <p>Items: {order.orderItems?.map(item => item.product?.name || 'Unknown Product').join(', ')}</p>
                </div>,
                {
                  toastId: `order-${order.orderId}`,
                  autoClose: 5000,
                }
              );
            }
          } else if (order.status === 'completed' && newNotifiedOrderIds.has(order.orderId)) {
            newNotifiedOrderIds.delete(order.orderId);
            toast.dismiss(`order-${order.orderId}`);
          }
        });
        return newNotifiedOrderIds;
      });
    }
  }, [orders]);

  // Reset current page if itemsPerPage changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  // If current page is empty but there are total results, reset to page 1
  useEffect(() => {
    if (!isLoading && orders && orders.length === 0 && totalCount > 0 && currentPage > 1) {
      setCurrentPage(1);
    }
  }, [orders, totalCount, isLoading, currentPage]);

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading orders...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Order Management</h1>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Total Orders ({totalCount})
        </h2>
        <ItemsPerPageSelector
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {orders && orders.length > 0 ? ( // Check if orders exist before rendering table
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shop Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items per Pack</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Special Instructions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {orders.sort((a, b) => {
              if (a.status === 'pending' && b.status !== 'pending') return -1;
              if (a.status !== 'pending' && b.status === 'pending') return 1;
              return 0;
            }).map((order) => (
                <tr key={order.orderId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.customer?.shopName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer?.mobile}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer?.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {/* Access order items from order.orderItems */}
                    {order.orderItems?.map(item => (
                      <div key={item.id}>
                        {item.product?.name || 'Unknown Product'} (x{item.quantity})
                        {item.priceAtOrder && <span className="text-xs text-gray-400"> ₹ {item.priceAtOrder.toFixed(2)}</span>}
                      </div>
                    ))}
                    {order.orderItems && order.orderItems.length > 0 && (
                      <div className="pt-2 mt-2 border-t border-gray-200 text-gray-700 font-semibold">
                        Total: {order.orderItems.reduce((sum, item) => sum + item.quantity, 0)} units, ₹ {order.orderItems.reduce((sum, item) => sum + (item.priceAtOrder * item.quantity), 0).toFixed(2)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.orderItems?.map(item => (
                      <div key={item.id}>
                        {item.itemsPerPack || 'N/A'}
                      </div>
                    ))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.orderItems?.map(item => (
                      <div key={item.id}>
                        {item.specialInstructions || 'N/A'}
                      </div>
                    ))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <input
                      type="checkbox"
                      checked={order.status === 'completed'}
                      onChange={() => handleStatusChange(order.orderId, order.status)}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500 mb-4">
              There are no orders to display at the moment.
            </p>
          </div>
        )}
      </div>
      {orders && orders.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalCount / itemsPerPage)}
          onPageChange={setCurrentPage}
          totalItems={totalCount}
          itemsPerPage={itemsPerPage}
        />
      )}
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default AdminOrderManagementPage;
