import { CreateUserResponse, User, Order } from "../types";
import { API_BASE_URL } from '../config';

export const adminService = {
    createUser: async (username: string, role: string, token: string): Promise<CreateUserResponse> => {
        const response = await fetch(`${API_BASE_URL}/admin/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token,
            },
            body: JSON.stringify({ username, role }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create user');
        }

        return response.json();
    },

    getAllUsers: async (token: string, page: number = 1, limit: number = 10): Promise<{ users: User[], totalCount: number }> => {
        const response = await fetch(`${API_BASE_URL}/admin/users?page=${page}&limit=${limit}`, {
            headers: {
                'x-auth-token': token,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch users');
        }

        return response.json();
    },

    deleteUser: async (userId: string, token: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'x-auth-token': token,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete user');
        }
    },

    updateUser: async (userId: string, role: 'admin' | 'user', token: string): Promise<User> => {
        const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token,
            },
            body: JSON.stringify({ role }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update user');
        }

        return response.json();
    },

    getAllOrders: async (token: string, page: number = 1, limit: number = 10): Promise<{ orders: Order[], totalCount: number }> => {
        const response = await fetch(`${API_BASE_URL}/order?page=${page}&limit=${limit}`, {
            headers: {
                'x-auth-token': token,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch orders');
        }

        return response.json();
    },

    updateOrderStatus: async (orderId: number, status: 'pending' | 'completed', token: string): Promise<Order> => {
        const response = await fetch(`${API_BASE_URL}/order/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token,
            },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update order status');
        }

        return response.json();
    },

    importProducts: async (file: File, token: string): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch(`${API_BASE_URL}/admin/products/import`, {
            method: 'POST',
            headers: {
                'x-auth-token': token,
            },
            body: formData,
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Import failed');
        }
        return 'Products imported successfully!';
    },
};
