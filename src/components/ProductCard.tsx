import React from 'react';

import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return { text: 'Out of Stock', color: 'text-red-600 bg-red-50 border-red-200' };
    } else if (stock <= 10) {
      return { text: 'Low Stock', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    } else {
      return { text: 'In Stock', color: 'text-green-600 bg-green-50 border-green-200' };
    }
  };

  const stockStatus = getStockStatus(product.stock);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200">
      <div className="aspect-w-16 aspect-h-12 bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-1">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 font-medium">{product.company}</p>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {product.category}
          </span>
          <span className="text-sm font-medium text-gray-700">{product.unitSize}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${stockStatus.color}`}>
            {stockStatus.text}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;