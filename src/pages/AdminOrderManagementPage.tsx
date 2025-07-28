import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../services/adminService';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types/order';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminOrderManagementPage: React.FC = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [notifiedOrderIds, setNotifiedOrderIds] = useState<Set<number>>(new Set());

  const { data: orders, isLoading, error } = useQuery<Order[], Error>({
    queryKey: ['orders'],
    queryFn: () => adminService.getAllOrders(token!),
    enabled: !!token,
  });

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
      const currentNotified = new Set(notifiedOrderIds);
      orders.forEach(order => {
        if (order.status === 'pending' && !currentNotified.has(order.orderId)) {
          toast.info(
            <div className="flex flex-col">
              <p className="font-bold">New Order Received!</p>
              <p>Order ID: {order.orderId}</p>
              <p>User ID: {order.userId}</p>
              <p>Items: {order.items.map(item => item.name).join(', ')}</p>
            </div>,
            {
              toastId: `order-${order.orderId}`,
              autoClose: 5000,
            }
          );
          currentNotified.add(order.orderId);
        }
        if (order.status === 'completed' && currentNotified.has(order.orderId)) {
          toast.dismiss(`order-${order.orderId}`);
          currentNotified.delete(order.orderId);
        }
      });
      setNotifiedOrderIds(currentNotified);
    }
  }, [orders]);

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading orders...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Order Management</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders?.map((order) => (
              <tr key={order.orderId}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customerInfo.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customerInfo.mobile}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customerInfo.address}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.items.map(item => (
                    <div key={item.id}>
                      {item.name} (x{item.quantity})
                      {item.unitSize && <span className="text-xs text-gray-400"> - {item.unitSize}</span>}
                      {item.itemsPerPack && <span className="text-xs text-gray-400"> - {item.itemsPerPack} items/pack</span>}
                      {item.note && <p className="text-xs italic text-gray-400">Note: {item.note}</p>}
                    </div>
                  ))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.timestamp).toLocaleString()}</td>
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
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default AdminOrderManagementPage;