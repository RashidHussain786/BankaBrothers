import React, { useState } from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';

interface FilterAndSearchAreaProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  companies: string[];
  categories: string[];
  brands: string[];
  sizes: string[];
  selectedCompany: string;
  selectedCategory: string;
  selectedBrand: string;
  selectedSize: string;
  showInStockOnly: boolean;
  onCompanyChange: (company: string) => void;
  onCategoryChange: (category: string) => void;
  onBrandChange: (brand: string) => void;
  onSizeChange: (size: string) => void;
  onToggleInStockOnly: (showOnly: boolean) => void;
}

const FilterAndSearchArea: React.FC<FilterAndSearchAreaProps> = ({
  searchTerm,
  onSearchChange,
  companies,
  categories,
  brands,
  sizes,
  selectedCompany,
  selectedCategory,
  selectedBrand,
  selectedSize,
  showInStockOnly,
  onCompanyChange,
  onCategoryChange,
  onBrandChange,
  onSizeChange,
  onToggleInStockOnly
}) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
      {/* Desktop Layout - All in one line */}
      <div className="hidden md:block">
        <div className="grid grid-cols-12 gap-4 items-end">
          {/* Search Field */}
          <div className="col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Products
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products or companies..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>
          </div>

          {/* Company Filter */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company
            </label>
            <div className="relative">
              <select
                value={selectedCompany}
                onChange={(e) => onCompanyChange(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white md:appearance-none pr-8"
              >
                <option value="">All Companies</option>
                {companies.map((company) => (
                  <option key={company} value={company}>
                    {company}
                  </option>
                ))}
              </select>
              <ChevronDown className="hidden md:block absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Category Filter */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white md:appearance-none pr-8"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <ChevronDown className="hidden md:block absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Brand Filter */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand
            </label>
            <div className="relative">
              <select
                value={selectedBrand}
                onChange={(e) => onBrandChange(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white md:appearance-none pr-8"
              >
                <option value="">All Brands</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
              <ChevronDown className="hidden md:block absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Size Filter */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Size
            </label>
            <div className="relative">
              <select
                value={selectedSize}
                onChange={(e) => onSizeChange(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white md:appearance-none pr-8"
              >
                <option value="">All Sizes</option>
                {sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <ChevronDown className="hidden md:block absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* In Stock Only Toggle */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Filter
            </label>
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showInStockOnly}
                  onChange={(e) => onToggleInStockOnly(e.target.checked)}
                  className="sr-only"
                />
                <div className={`relative w-11 h-6 transition duration-200 ease-linear rounded-full ${showInStockOnly ? 'bg-blue-600' : 'bg-gray-200'}`}>
                  <div className={`absolute left-0 top-0 bg-white w-6 h-6 rounded-full transition duration-100 ease-linear transform ${showInStockOnly ? 'translate-x-full border-blue-600' : 'border-gray-200'} border-2`}></div>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">
                  In Stock Only
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        {!showMobileFilters ? (
          /* Search Bar with Filter Icon */
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>
            <button
              onClick={toggleMobileFilters}
              className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Filter className="h-5 w-5" />
            </button>
          </div>
        ) : (
          /* Filter Controls */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              </div>
              <button
                onClick={toggleMobileFilters}
                className="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Company Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company
              </label>
              <div className="relative">
                <select
                  value={selectedCompany}
                  onChange={(e) => onCompanyChange(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white md:appearance-none pr-8"
                >
                  <option value="">All Companies</option>
                  {companies.map((company) => (
                    <option key={company} value={company}>
                      {company}
                    </option>
                  ))}
                </select>
                <ChevronDown className="hidden md:block absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white md:appearance-none pr-8"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <ChevronDown className="hidden md:block absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand
              </label>
              <div className="relative">
                <select
                  value={selectedBrand}
                  onChange={(e) => onBrandChange(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white md:appearance-none pr-8"
                >
                  <option value="">All Brands</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
                <ChevronDown className="hidden md:block absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Size Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size
              </label>
              <div className="relative">
                <select
                  value={selectedSize}
                  onChange={(e) => onSizeChange(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white md:appearance-none pr-8"
                >
                  <option value="">All Sizes</option>
                  {sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <ChevronDown className="hidden md:block absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* In Stock Only Toggle */}
            <div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showInStockOnly}
                  onChange={(e) => onToggleInStockOnly(e.target.checked)}
                  className="sr-only"
                />
                <div className={`relative w-11 h-6 transition duration-200 ease-linear rounded-full ${showInStockOnly ? 'bg-blue-600' : 'bg-gray-200'}`}>
                  <div className={`absolute left-0 top-0 bg-white w-6 h-6 rounded-full transition duration-100 ease-linear transform ${showInStockOnly ? 'translate-x-full border-blue-600' : 'border-gray-200'} border-2`}></div>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700">
                  In Stock Only
                </span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterAndSearchArea;