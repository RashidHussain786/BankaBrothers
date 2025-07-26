import React from 'react';
import { Store } from 'lucide-react';
import CartIcon from './CartIcon';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <Store className="h-8 w-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Banka Brother</h1>
          </div>
        </Link>
        <div className="flex items-center space-x-4">
          {isAdmin && (
            <Link
              to="/admin/create-user"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Add User
            </Link>
          )}
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Login
            </Link>
          )}
          <CartIcon />
        </div>
      </div>
    </header>
  );
};

export default Header;