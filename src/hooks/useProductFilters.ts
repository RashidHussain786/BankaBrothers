import { useState } from 'react';

export const useProductFilters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showInStockOnly, setShowInStockOnly] = useState(false);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCompany('');
    setSelectedCategory('');
    setShowInStockOnly(false);
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedCompany,
    setSelectedCompany,
    selectedCategory,
    setSelectedCategory,
    showInStockOnly,
    setShowInStockOnly,
    clearFilters,
    hasActiveFilters: Boolean(searchTerm || selectedCompany || selectedCategory || showInStockOnly)
  };
};
