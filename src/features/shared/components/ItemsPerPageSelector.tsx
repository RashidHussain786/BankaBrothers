import React from 'react';
import { ChevronDown } from 'lucide-react';

interface ItemsPerPageSelectorProps {
  itemsPerPage: number;
  onItemsPerPageChange: (items: number) => void;
}

const ItemsPerPageSelector: React.FC<ItemsPerPageSelectorProps> = ({
  itemsPerPage,
  onItemsPerPageChange
}) => {
  const options = [8, 12, 16, 24, 32];

  return (
    <div className="flex items-center space-x-2">
      <span className="text-xs sm:text-sm text-gray-700 whitespace-nowrap">Items per page:</span>
      <div className="relative">
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="block w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none pr-6 sm:pr-8 text-xs sm:text-sm"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-1 sm:right-2 top-2.5 h-3 w-3 sm:h-4 sm:w-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
};

export default ItemsPerPageSelector;