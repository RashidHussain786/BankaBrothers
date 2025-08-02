
import React, { useState } from 'react';

interface ColumnSelectorProps {
  columns: { key: string; label: string }[];
  selectedColumns: string[];
  onColumnChange: (selected: string[]) => void;
}

const ColumnSelector: React.FC<ColumnSelectorProps> = ({ columns, selectedColumns, onColumnChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCheckboxChange = (columnKey: string) => {
    const newSelectedColumns = selectedColumns.includes(columnKey)
      ? selectedColumns.filter(key => key !== columnKey)
      : [...selectedColumns, columnKey];
    onColumnChange(newSelectedColumns);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Columns
      </button>
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {columns.map(column => (
              <label key={column.key} className="flex items-center px-4 py-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                  checked={selectedColumns.includes(column.key)}
                  onChange={() => handleCheckboxChange(column.key)}
                  disabled={selectedColumns.length >= 11 && !selectedColumns.includes(column.key)}
                />
                <span className="ml-3">{column.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColumnSelector;
