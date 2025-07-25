import React from 'react';
import { Grid, List } from 'lucide-react';

interface ViewToggleProps {
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onViewModeChange }) => {
  return (
    <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
      <button
        onClick={() => onViewModeChange('grid')}
        className={`flex items-center px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200 ${
          viewMode === 'grid'
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`}
      >
        <Grid className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
        Grid
      </button>
      <button
        onClick={() => onViewModeChange('table')}
        className={`flex items-center px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200 ${
          viewMode === 'table'
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`}
      >
        <List className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
        Table
      </button>
    </div>
  );
};

export default ViewToggle;