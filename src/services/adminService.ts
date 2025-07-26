import { CreateUserResponse } from "../types";
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
};
