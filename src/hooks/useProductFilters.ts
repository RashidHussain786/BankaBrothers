import { useState, useEffect } from 'react';
import { productService } from '../services/productService';

export const useProductFilters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [showInStockOnly, setShowInStockOnly] = useState(false);

  const [companies, setCompanies] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [filterError, setFilterError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      setLoadingFilters(true);
      setFilterError(null);
      try {
        const fetchedCompanies = await productService.getCompanies();
        setCompanies(fetchedCompanies);

        const fetchedCategories = await productService.getCategories(selectedCompany);
        setCategories(fetchedCategories);

        const fetchedBrands = await productService.getBrands(selectedCompany, selectedCategory);
        setBrands(fetchedBrands);

        const fetchedSizes = await productService.getSizes(selectedCompany, selectedCategory, selectedBrand);
        setSizes(fetchedSizes);

      } catch (err) {
        setFilterError(err instanceof Error ? err.message : 'Failed to load filter options');
      } finally {
        setLoadingFilters(false);
      }
    };

    fetchFilterOptions();
  }, [selectedCompany, selectedCategory, selectedBrand]);

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
    hasActiveFilters: Boolean(searchTerm || selectedCompany || selectedCategory || selectedBrand || selectedSize || showInStockOnly),
    companies,
    categories,
    brands,
    sizes,
    loadingFilters,
    filterError,
  };
};
