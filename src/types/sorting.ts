import { Product } from './product';

export type SortDirection = 'asc' | 'desc' | null;
export type SortableColumn = 'name' | 'company' | 'category' | 'unitSize' | 'stock' | 'status';

export interface UseSortingReturn {
  sortedData: Product[];
  sortColumn: SortableColumn | null;
  sortDirection: SortDirection;
  handleSort: (column: SortableColumn) => void;
}