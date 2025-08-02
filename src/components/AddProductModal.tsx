import React, { useState } from 'react';
import { Product } from '../types';

interface AddProductModalProps {
    onClose: () => void;
    onSave: (product: Omit<Product, 'id' | 'variant'> & { variant: Omit<Product['variant'], 'id' | 'productId'> }) => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ onClose, onSave }) => {
    const [name, setName] = useState('');
    const [company, setCompany] = useState('');
    const [category, setCategory] = useState('');
    const [unitSize, setUnitSize] = useState('');
    const [price, setPrice] = useState(0);
    const [stockQuantity, setStockQuantity] = useState(0);

    const handleSave = () => {
        onSave({
            name,
            company,
            category,
            variant: {
                unitSize,
                price,
                stockQuantity,
            },
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md mt-1"
                        />
                    </div>
                    <div>
                        <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
                        <input
                            type="text"
                            id="company"
                            placeholder="Company"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md mt-1"
                        />
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                        <input
                            type="text"
                            id="category"
                            placeholder="Category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md mt-1"
                        />
                    </div>
                    <div>
                        <label htmlFor="unitSize" className="block text-sm font-medium text-gray-700">Unit Size</label>
                        <input
                            type="text"
                            id="unitSize"
                            placeholder="Unit Size"
                            value={unitSize}
                            onChange={(e) => setUnitSize(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md mt-1"
                        />
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                        <input
                            type="number"
                            id="price"
                            placeholder="Price"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            className="w-full px-3 py-2 border rounded-md mt-1"
                        />
                    </div>
                    <div>
                        <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                        <input
                            type="number"
                            id="stockQuantity"
                            placeholder="Stock Quantity"
                            value={stockQuantity}
                            onChange={(e) => setStockQuantity(Number(e.target.value))}
                            className="w-full px-3 py-2 border rounded-md mt-1"
                        />
                    </div>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-100">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddProductModal;