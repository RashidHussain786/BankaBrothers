import React, { useRef, useState } from 'react';
import { REQUIRED_FIELDS } from '../config'

interface ImportProductsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (file: File) => Promise<void>;
}

const ImportProductsModal: React.FC<ImportProductsModalProps> = ({ isOpen, onClose, onUpload }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.name.endsWith('.csv')) {
            setError('Please select a CSV file.');
            return;
        }
        setSelectedFile(file);
    };

    const handleImport = async () => {
        if (!selectedFile) {
            setError('Please select a CSV file first.');
            return;
        }
        setIsLoading(true);
        await onUpload(selectedFile);
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setIsLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    onClick={onClose}
                    disabled={isLoading}
                >
                    &times;
                </button>
                <h2 className="text-xl font-bold mb-4">Import Products from CSV</h2>
                <p className="mb-2 text-sm text-gray-700">Required CSV columns:</p>
                <ul className="mb-4 text-xs text-gray-600 list-disc list-inside">
                    {REQUIRED_FIELDS.map(field => (
                        <li key={field}>{field}</li>
                    ))}
                </ul>
                <div className="flex items-center space-x-2 mb-4">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        className="flex-1 p-2 border rounded"
                        onChange={handleFileChange}
                        disabled={isLoading}
                    />
                </div>
                {error && <div className="text-red-500 text-xs mb-2">{error}</div>}
                {selectedFile && (
                    <p className="text-sm text-gray-600 mb-4">
                        Selected file: {selectedFile.name}
                    </p>
                )}
                <div className="flex justify-end space-x-2">
                    <button
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300 flex items-center ${isLoading ? 'cursor-not-allowed' : ''
                            }`}
                        onClick={handleImport}
                        disabled={!selectedFile || isLoading}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Importing...
                            </>
                        ) : (
                            'Import'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImportProductsModal;
