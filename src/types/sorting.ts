

export type SortDirection = 'asc' | 'desc' | null;
export type SortableColumn = 'name' | 'company' | 'category' | 'unitSize' | 'status';

export interface UseSortingReturn {
  sortColumn: SortableColumn | null;
  sortDirection: SortDirection;
  handleSort: (column: SortableColumn) => void;
}