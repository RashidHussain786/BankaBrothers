import React from 'react';

import { Product } from '../types';
import { useAuth } from '../context/AuthContext';

interface ProductCardProps {
  product: Product;
  onOrderClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onOrderClick }) => {
  const { isAdmin } = useAuth();
  const getStockStatus = (stockQuantity: number) => {
    if (stockQuantity === 0) {
      return { text: 'Out of Stock', color: 'text-red-600 bg-red-50 border-red-200' };
    } else if (stockQuantity <= 10) {
      return { text: 'Low Stock', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    } else {
      return { text: 'In Stock', color: 'text-green-600 bg-green-50 border-green-200' };
    }
  };

  const stockStatus = getStockStatus(product.stockQuantity);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200">
      

      <div className="p-3">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-1">
            {product.name}
          </h3>
          <p className="text-xs md:text-sm text-gray-600 font-medium">{product.company}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {product.category}
            </span>
            <span className="text-sm font-medium text-gray-700">{product.unitSize}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${stockStatus.color}`}>
              {stockStatus.text}
            </span>
            {isAdmin ? (
              <span className="inline-flex items-center text-sm font-medium text-gray-700">
                {product.stockQuantity} units in stock
              </span>
            ) : (
              <button
                className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${product.stockQuantity > 0
                    ? 'text-white bg-blue-600 hover:bg-blue-700'
                    : 'text-gray-500 bg-gray-100 cursor-not-allowed'
                  }`}
                onClick={() => onOrderClick(product)}
                disabled={product.stockQuantity === 0}
              >
                {product.stockQuantity > 0 ? 'Order' : 'Out of Stock'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;