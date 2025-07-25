import { useState } from 'react';

export const useProductFilters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [showInStockOnly, setShowInStockOnly] = useState(false);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCompany('');
    setSelectedCategory('');
    setSelectedBrand('');
    setSelectedSize('');
    setShowInStockOnly(false);
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedCompany,
    setSelectedCompany,
    selectedCategory,
    setSelectedCategory,
    selectedBrand,
    setSelectedBrand,
    selectedSize,
    setSelectedSize,
    showInStockOnly,
    setShowInStockOnly,
    clearFilters,
    hasActiveFilters: Boolean(searchTerm || selectedCompany || selectedCategory || selectedBrand || selectedSize || showInStockOnly)
  };
};
