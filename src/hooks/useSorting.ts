import { useState, useEffect } from 'react';
import { SortDirection, SortableColumn, UseSortingReturn } from '../types';

export const useSorting = (): UseSortingReturn => {
  const getInitialSortColumn = (): SortableColumn | null => {
    const params = new URLSearchParams(window.location.search);
    return params.get('sort') as SortableColumn | null;
  };

  const getInitialSortDirection = (): SortDirection => {
    const params = new URLSearchParams(window.location.search);
    return (params.get('direction') as SortDirection) || null;
  };

  const [sortColumn, setSortColumn] = useState<SortableColumn | null>(getInitialSortColumn);
  const [sortDirection, setSortDirection] = useState<SortDirection>(getInitialSortDirection);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (sortColumn) {
      params.set('sort', sortColumn);
    } else {
      params.delete('sort');
    }
    if (sortDirection) {
      params.set('direction', sortDirection);
    } else {
      params.delete('direction');
    }
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  }, [sortColumn, sortDirection]);

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
    sortColumn,
    sortDirection,
    handleSort
  };
};