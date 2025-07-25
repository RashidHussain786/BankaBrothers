import { useState } from 'react';
import Header from './components/Header';
import FilterAndSearchArea from './components/FilterAndSearchArea';
import ProductCard from './components/ProductCard';
import ProductTable from './components/ProductTable';
import ViewToggle from './components/ViewToggle';
import Pagination from './components/Pagination';
import ItemsPerPageSelector from './components/ItemsPerPageSelector';
import { useProducts } from './hooks/useProducts';
import { usePagination } from './hooks/usePagination';
import { useSorting } from './hooks/useSorting';
import { useProductFilters } from './hooks/useProductFilters';
import { useFiltering } from './hooks/useFiltering';
import { Loader, AlertCircle } from 'lucide-react';
import { Product } from './types';

function App() {
  const { products, companies, categories, loading, error } = useProducts();
  const {
    searchTerm,
    setSearchTerm,
    selectedCompany,
    setSelectedCompany,
    selectedCategory,
    setSelectedCategory,
    showInStockOnly,
    setShowInStockOnly,
    clearFilters,
    hasActiveFilters
  } = useProductFilters();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const filteredProducts = useFiltering<Product>(products, product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCompany = !selectedCompany || product.company === selectedCompany;
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesStock = !showInStockOnly || product.stock > 0;

    return matchesSearch && matchesCompany && matchesCategory && matchesStock;
  });

  const {
    sortedData,
    sortColumn,
    sortDirection,
    handleSort
  } = useSorting({ data: filteredProducts });

  const {
    currentPage,
    totalPages,
    paginatedData,
    goToPage
  } = usePagination({
    data: sortedData,
    itemsPerPage
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-lg text-gray-600">Loading products...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-6 w-6" />
            <span className="text-lg">Error: {error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Search and Filter Section */}
        <div className="mb-8">
          <FilterAndSearchArea
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            companies={companies}
            categories={categories}
            selectedCompany={selectedCompany}
            selectedCategory={selectedCategory}
            showInStockOnly={showInStockOnly}
            onCompanyChange={setSelectedCompany}
            onCategoryChange={setSelectedCategory}
            onToggleInStockOnly={setShowInStockOnly}
          />
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Products ({filteredProducts.length})
            </h2>
            <div className="flex flex-row items-center space-x-2 sm:space-x-4">
              <ItemsPerPageSelector
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={setItemsPerPage}
              />
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 text-xs sm:text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 whitespace-nowrap"
                >
                  Clear Filters
                </button>
              )}
              <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {paginatedData.length > 0 ? (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {paginatedData.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="mb-8">
                <ProductTable
                  products={paginatedData}
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
              </div>
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
              totalItems={sortedData.length}
              itemsPerPage={itemsPerPage}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>&copy; 2025 Banka Brother. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;