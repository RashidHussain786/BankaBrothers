import React from 'react';
import { Store } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center sm:justify-start">
          <Store className="h-8 w-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Banka Brother</h1>
            <p className="text-sm text-gray-600">Stock Management System</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;