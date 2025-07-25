import { } from 'react';
import { UsePaginationProps, UsePaginationReturn } from '../types';

export const usePagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange
}: UsePaginationProps): UsePaginationReturn => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const goToPage = (page: number) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    onPageChange(pageNumber);
  };

  const nextPage = () => {
    goToPage(currentPage + 1);
  };

  const prevPage = () => {
    goToPage(currentPage - 1);
  };

  const canGoNext = currentPage < totalPages;
  const canGoPrev = currentPage > 1;

  // No internal currentPage state or reset logic needed here

  return {
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    canGoNext,
    canGoPrev
  };
};