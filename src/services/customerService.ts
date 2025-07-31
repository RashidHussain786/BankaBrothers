import { API_BASE_URL } from '../config';
import { Customer } from '../types/customer';

export const createCustomer = async (customerData: Omit<Customer, 'id'>): Promise<Customer> => {
  const response = await fetch(`${API_BASE_URL}/customers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customerData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    let errorMessage = errorData.message || 'Failed to create customer';
    if (errorMessage.includes('Unique constraint failed on the fields: (`shop_name`)')) {
      errorMessage = 'A customer with this shop name already exists.';
    } else if (errorMessage.includes('Unique constraint failed on the fields: (`mobile`)')) {
      errorMessage = 'A customer with this mobile number already exists.';
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

export const getAllCustomers = async (page: number = 1, limit: number = 10): Promise<{ customers: Customer[], totalCount: number }> => {
  const response = await fetch(`${API_BASE_URL}/customers?page=${page}&limit=${limit}`);

  if (!response.ok) {
    throw new Error('Failed to fetch customers');
  }

  return response.json();
};

export const updateCustomer = async (customerId: number, customerData: Partial<Customer>): Promise<Customer> => {
  const response = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customerData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update customer');
  }

  return response.json();
};

export const deleteCustomer = async (customerId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete customer');
  }
};
