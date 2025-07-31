import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { X } from 'lucide-react';

interface AddToCartModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, itemsPerPack?: string, specialInstructions?: string) => void;
}

const AddToCartModal: React.FC<AddToCartModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [itemsPerPack, setItemsPerPack] = useState('');

  useEffect(() => {
    if (isOpen && product) {
      setQuantity(1);
      setSpecialInstructions('');
      setItemsPerPack(''); // Ensure it's empty by default
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1) {
      setQuantity(value);
    } else if (e.target.value === '') {
      setQuantity(0); // Allow empty input temporarily for user to type
    }
  };

  const handleItemsPerPackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItemsPerPack(e.target.value);
  };

  const handleAddToCart = () => {
    if (!product.stockQuantity || product.stockQuantity <= 0) {
      alert('This product is out of stock.');
      return;
    }
    if (quantity < 1) {
      alert('Quantity must be at least 1.');
      return;
    }
    // itemsPerPack is now a string, so we only check if it's provided
    if (!itemsPerPack.trim()) {
      alert('Items per Pack/Unit is required.');
      return;
    }
    onAddToCart(product, quantity, itemsPerPack, specialInstructions);
    onClose();
  };

  const isAddToCartDisabled = !product.stockQuantity || product.stockQuantity <= 0 || quantity < 1 || !itemsPerPack.trim();

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Add to Cart</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Product Name</label>
          <p className="mt-1 text-lg font-semibold text-gray-900">{product.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Company</label>
            <p className="mt-1 text-base text-gray-700">{product.company}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Unit Size</label>
            <p className="mt-1 text-base text-gray-700">{product.unitSize}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              id="quantity"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="itemsPerPack" className="block text-sm font-medium text-gray-700">Items per Pack/Unit</label>
            <input
              type="text"
              id="itemsPerPack"
              value={itemsPerPack}
              onChange={handleItemsPerPackChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., 6 pcs, 1 dozen"
            />
          </div>
        </div>

        <div>
          <label htmlFor="specialInstructions" className="block text-sm font-medium text-gray-700">Special Instructions</label>
          <textarea
            id="specialInstructions"
            rows={3}
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., 'Deliver after 5 PM', 'Fragile item'"
          ></textarea>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isAddToCartDisabled}
          className={`w-full mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white ${isAddToCartDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
        >
          {!product.stockQuantity || product.stockQuantity <= 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default AddToCartModal;