import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

const CartIcon: React.FC = () => {
  const { totalItemsInCart } = useCart();

  return (
    <Link
      to="/cart"
      className="relative bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
      aria-label="View Cart"
    >
      <ShoppingCart className="h-6 w-6" />
      {totalItemsInCart > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
          {totalItemsInCart}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;