import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/adminService';

const AdminCreateUserPage: React.FC = () => {
  const { isAuthenticated, isAdmin, token } = useAuth();
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('user');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
  const [createdUsername, setCreatedUsername] = useState<string | null>(null);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setGeneratedPassword(null);

    if (!isAuthenticated || !isAdmin) {
      setError('You are not authorized to perform this action.');
      return;
    }

    try {
      const data = await adminService.createUser(username, role, token || '');
      setMessage(data.message);
      setGeneratedPassword(data.user.password);
      setCreatedUsername(username);
      setUsername('');
      setRole('user');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-lg shadow-md">
          <h2 className="mt-6 text-center text-2xl font-extrabold text-gray-900">Access Denied</h2>
          <p className="text-center text-gray-600">You do not have administrative privileges to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create New User
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleCreateUser}>
          <div>
            <label htmlFor="username" className="sr-only">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="off"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="role" className="sr-only">Role</label>
            <select
              id="role"
              name="role"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{message}</span>
              {createdUsername && (
                <div className="mt-2 flex items-center justify-between">
                  <span>Username: <span className="font-bold">{createdUsername}</span></span>
                  <button
                    onClick={() => handleCopy(createdUsername)}
                    className="ml-2 px-2 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                    type="button"
                  >
                    Copy
                  </button>
                </div>
              )}
              {generatedPassword && (
                <div className="mt-2 flex items-center justify-between">
                  <span>Generated Password: <span className="font-bold">{generatedPassword}</span></span>
                  <button
                    onClick={() => handleCopy(generatedPassword)}
                    className="ml-2 px-2 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                    type="button"
                  >
                    Copy
                  </button>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateUserPage;