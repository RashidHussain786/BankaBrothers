import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { X } from 'lucide-react';

interface AddToCartModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, note: string, itemsPerPack: number) => void;
}

const AddToCartModal: React.FC<AddToCartModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [itemsPerPack, setItemsPerPack] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setNote('');
      setItemsPerPack(1);
    }
  }, [isOpen]);

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
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1) {
      setItemsPerPack(value);
    } else if (e.target.value === '') {
      setItemsPerPack(0); // Allow empty input temporarily for user to type
    }
  };

  const handleAddToCart = () => {
    if (!product.isAvailable) {
      alert('This product is out of stock.');
      return;
    }
    if (quantity < 1) {
      alert('Quantity must be at least 1.');
      return;
    }
    if (itemsPerPack < 1) {
      alert('Items per Pack/Unit must be at least 1.');
      return;
    }
    onAddToCart(product, quantity, note, itemsPerPack);
    onClose();
  };

  const isAddToCartDisabled = !product.isAvailable || quantity < 1 || itemsPerPack < 1;

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
              type="number"
              id="itemsPerPack"
              min="1"
              value={itemsPerPack}
              onChange={handleItemsPerPackChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-700">Any special instructions?</label>
          <textarea
            id="note"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., 'Deliver after 5 PM', 'Fragile item'"
          ></textarea>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isAddToCartDisabled}
          className={`w-full mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white ${isAddToCartDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
        >
          {!product.isAvailable ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default AddToCartModal;