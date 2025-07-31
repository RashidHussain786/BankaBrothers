
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../services/adminService';
import { useAuth } from '../context/AuthContext';
import { User } from '../types';
import { Link } from 'react-router-dom';
import EditUserModal from '../components/EditUserModal';
import Pagination from '../components/Pagination';
import ItemsPerPageSelector from '../components/ItemsPerPageSelector';

const AdminUserManagementPage: React.FC = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data, isLoading, error } = useQuery<{ users: User[], totalCount: number }, Error>({
    queryKey: ['users', currentPage, itemsPerPage],
    queryFn: () => adminService.getAllUsers(token!, currentPage, itemsPerPage),
    enabled: !!token,
  });

  const users = data?.users;
  const totalCount = data?.totalCount || 0;

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => adminService.deleteUser(userId, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      alert('User deleted successfully!');
    },
    onError: (error: Error) => {
      alert(`Failed to delete user: ${error.message}`);
    }
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: 'admin' | 'user' }) => adminService.updateUser(userId, role, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      alert('User updated successfully!');
      setIsEditModalOpen(false);
    },
    onError: (error: Error) => {
      alert(`Failed to update user: ${error.message}`);
    }
  });

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUserMutation.mutate(userId);
    }
  };

  const handleOpenEditModal = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleSaveUser = (userId: string, role: 'admin' | 'user') => {
    updateUserMutation.mutate({ userId, role });
  };

  // Reset current page if itemsPerPage changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  // If current page is empty but there are total results, reset to page 1
  useEffect(() => {
    if (!isLoading && users && users.length === 0 && totalCount > 0 && currentPage > 1) {
      setCurrentPage(1);
    }
  }, [users, totalCount, isLoading, currentPage]);

  // Prefetch next page
  useEffect(() => {
    const totalPages = Math.ceil(totalCount / itemsPerPage);
    const nextPage = currentPage + 1;

    if (nextPage <= totalPages) {
      queryClient.prefetchQuery({
        queryKey: ['users', nextPage, itemsPerPage],
        queryFn: () => adminService.getAllUsers(token!, nextPage, itemsPerPage),
      });
    }
  }, [currentPage, itemsPerPage, totalCount, queryClient, token]);

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading users...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <div className="flex items-center space-x-4">
          <ItemsPerPageSelector
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
          />
          <Link
            to="/admin/create-user"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 shadow-sm"
          >
            Add User
          </Link>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Orders
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users?.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.role}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.totalOrders}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleOpenEditModal(user)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-600 hover:text-red-900"
                    disabled={deleteUserMutation.isPending}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalCount / itemsPerPage)}
        onPageChange={setCurrentPage}
        totalItems={totalCount}
        itemsPerPage={itemsPerPage}
      />
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={selectedUser}
        onSave={handleSaveUser}
      />
    </div>
  );
};

export default AdminUserManagementPage;
