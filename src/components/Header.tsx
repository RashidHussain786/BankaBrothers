import React from 'react';
import { Store } from 'lucide-react';
import CartIcon from './CartIcon';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <Store className="h-8 w-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Banka Brother</h1>
          </div>
        </Link>
        <CartIcon />
      </div>
    </header>
  );
};

export default Header;