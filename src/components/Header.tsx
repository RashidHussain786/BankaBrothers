import React from 'react';
import { Store, User } from 'lucide-react';
import CartIcon from './CartIcon';
import ImportProductsModal from './ImportProductsModal';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/adminService';
import { useQueryClient } from '@tanstack/react-query';

const Header: React.FC = () => {
  const { isAuthenticated, isAdmin, logout, token, user } = useAuth();
  const queryClient = useQueryClient();
  const [showImportModal, setShowImportModal] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <Store className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Banka Brothers</h1>
            </div>
          </Link>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-4">
            <div className="md:hidden">
              <CartIcon />
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {isAdmin && (
              <>
                <button
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  onClick={() => setShowImportModal(true)}
                >
                  Import Products
                </button>
                <Link
                  to="/admin/user-management"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Manage Users
                </Link>
              </>
            )}
            <CartIcon />
            <div className="flex items-center">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center text-gray-700 hover:text-gray-900"
                  >
                    <User className="h-6 w-6" />
                  </button>

                  {/* Dropdown menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                        {user?.username}
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile navigation */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} mt-4 space-y-3`}>
          {isAdmin && (
            <>
              <button
                className="block w-full text-left px-4 py-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                onClick={() => {
                  setShowImportModal(true);
                  setIsMenuOpen(false);
                }}
              >
                Import Products
              </button>
              <Link
                to="/admin/user-management"
                className="block px-4 py-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Manage Users
              </Link>
            </>
          )}
          {isAuthenticated ? (
            <>
              <div className="px-4 py-2 flex items-center space-x-2">
                <User className="h-6 w-6 text-gray-700" />
                <span className="text-gray-700 text-sm font-medium">
                  {user?.username}
                </span>
              </div>
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="block px-4 py-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {isAdmin && (
        <ImportProductsModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onUpload={async (file) => {
            try {
              if (!token) {
                throw new Error('Not authenticated');
              }
              await adminService.importProducts(file, token);
              await queryClient.invalidateQueries({ queryKey: ['products'] });
              alert('Products imported successfully!');
              setShowImportModal(false);
            } catch (e: Error | unknown) {
              const errorMessage = e instanceof Error ? e.message : 'Import failed';
              alert(errorMessage);
            }
          }}
        />
      )}
    </header>
  );
};

export default Header;