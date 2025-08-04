import React from 'react';

interface DeleteProductModalProps {
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteProductModal: React.FC<DeleteProductModalProps> = ({ onClose, onConfirm }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
                <p className="text-gray-600 mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
                <div className="flex justify-end space-x-4">
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-100">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteProductModal;