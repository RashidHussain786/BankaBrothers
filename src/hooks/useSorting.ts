import { useState, useMemo } from 'react';

export type SortDirection = 'asc' | 'desc' | null;
export type SortableColumn = 'name' | 'company' | 'category' | 'unitSize' | 'stock' | 'status';

import { Product } from '../types';

interface UseSortingProps {
  data: Product[];
}

interface UseSortingReturn {
  sortedData: Product[];
  sortColumn: SortableColumn | null;
  sortDirection: SortDirection;
  handleSort: (column: SortableColumn) => void;
}

export const useSorting = ({ data }: UseSortingProps): UseSortingReturn => {
  const [sortColumn, setSortColumn] = useState<SortableColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const getStockStatus = (stock: number): number => {
    if (stock === 0) return 0; // Out of Stock
    if (stock <= 10) return 1; // Low Stock
    return 2; // In Stock
  };

  const parseUnitSize = (unitSize: string): number => {
    // Extract number from unit size (e.g., "200g" -> 200, "1kg" -> 1000)
    const match = unitSize.match(/^(\d+(?:\.\d+)?)(.*)/);
    if (!match) return 0;
    
    const value = parseFloat(match[1]);
    const unit = match[2].toLowerCase();
    
    // Convert to grams for consistent comparison
    switch (unit) {
      case 'kg':
        return value * 1000;
      case 'g':
      case '':
        return value;
      default:
        return value;
    }
  };

  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) {
      return data;
    }

    const sorted = [...data].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortColumn) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'company':
          aValue = a.company.toLowerCase();
          bValue = b.company.toLowerCase();
          break;
        case 'category':
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        case 'unitSize':
          aValue = parseUnitSize(a.unitSize);
          bValue = parseUnitSize(b.unitSize);
          break;
        case 'stock':
          aValue = a.stock;
          bValue = b.stock;
          break;
        case 'status':
          aValue = getStockStatus(a.stock);
          bValue = getStockStatus(b.stock);
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return sorted;
  }, [data, sortColumn, sortDirection]);

  const handleSort = (column: SortableColumn) => {
    if (sortColumn === column) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortColumn(null);
      }
    } else {
      // New column, start with ascending
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  return {
    sortedData,
    sortColumn,
    sortDirection,
    handleSort
  };
};