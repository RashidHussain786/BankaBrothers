import React, { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { SortableColumn, SortDirection, Product } from '../types';
import { useAuth } from '../context/AuthContext';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';
import DeleteProductModal from './DeleteProductModal';
import { useProducts } from '../hooks/useProducts';

interface ProductTableProps {
  products: Product[];
  sortColumn: SortableColumn | null;
  sortDirection: SortDirection;
  onSort: (column: SortableColumn) => void;
  onOrderClick: (item: Product) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, sortColumn, sortDirection, onSort, onOrderClick }) => {
  const { isAdmin } = useAuth();
  const { addProduct, updateProduct, deleteProduct } = useProducts({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const getStockStatus = (stockQuantity: number) => {
    if (stockQuantity === 0) {
      return { text: 'Out of Stock', color: 'text-red-600 bg-red-50' };
    } else if (stockQuantity <= 10) {
      return { text: 'Low Stock', color: 'text-amber-600 bg-amber-50' };
    } else {
      return { text: 'In Stock', color: 'text-green-600 bg-green-50' };
    }
  };

  const getSortIcon = (column: SortableColumn) => {
    if (sortColumn !== column) {
      return <ChevronsUpDown className="h-4 w-4 text-gray-400" />;
    }

    if (sortDirection === 'asc') {
      return <ChevronUp className="h-4 w-4 text-blue-600" />;
    } else if (sortDirection === 'desc') {
      return <ChevronDown className="h-4 w-4 text-blue-600" />;
    }

    return <ChevronsUpDown className="h-4 w-4 text-gray-400" />;
  };

  const SortableHeader: React.FC<{
    column: SortableColumn;
    children: React.ReactNode;
    className?: string;
  }> = ({ column, children, className = "" }) => (
    <th
      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-150 select-none ${className}`}
      onClick={() => onSort(column)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {getSortIcon(column)}
      </div>
    </th>
  );

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      {isAdmin && (
        <div className="p-4">
          <button
            onClick={handleAddClick}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Add Product
          </button>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <SortableHeader column="name">Product</SortableHeader>
              <SortableHeader column="company">Company</SortableHeader>
              <SortableHeader column="category">Category</SortableHeader>
              <SortableHeader column="unitSize">Unit Size</SortableHeader>
              <SortableHeader column="price">Price</SortableHeader>
              <SortableHeader column="status">Status</SortableHeader>
              <SortableHeader column="stockQuantity" className="text-left">
                {isAdmin ? 'Stock Quantity' : 'Action'}
              </SortableHeader>
              {isAdmin && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((item) => {
              const stockStatus = getStockStatus(item.variant.stockQuantity);
              return (
                <tr key={`${item.id}-${item.variant.id}`} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                          {item.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">{item.company}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">{item.variant.unitSize}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">₹{item.variant.price.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${stockStatus.color}`}>
                      {stockStatus.text}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {isAdmin ? (
                        <span className="text-sm text-gray-900 font-medium">
                          {item.variant.stockQuantity} units
                        </span>
                      ) : (
                        <button
                          className={`px-4 py-2 text-white text-sm font-medium rounded-md transition-colors duration-200 ${item.variant.stockQuantity > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                            }`}
                          onClick={() => onOrderClick(item)}
                          disabled={item.variant.stockQuantity === 0}
                        >
                          {item.variant.stockQuantity > 0 ? 'Order' : 'Out of Stock'}
                        </button>
                      )}
                    </div>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item)}
                          className="p-1 text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {isAddModalOpen && (
        <AddProductModal
          onClose={() => setIsAddModalOpen(false)}
          onSave={(product) => {
            addProduct(product);
            setIsAddModalOpen(false);
          }}
        />
      )}
      {isEditModalOpen && selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          onClose={() => setIsEditModalOpen(false)}
          onSave={(product) => {
            updateProduct(product);
            setIsEditModalOpen(false);
          }}
        />
      )}
      {isDeleteModalOpen && selectedProduct && (
        <DeleteProductModal
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => {
            deleteProduct(selectedProduct.id);
            setIsDeleteModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default ProductTable;