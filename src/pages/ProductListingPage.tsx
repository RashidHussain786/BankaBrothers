import { useMemo, useState, useEffect } from 'react';
import FilterAndSearchArea from '../components/FilterAndSearchArea';
import ProductCard from '../components/ProductCard';
import ProductTable from '../components/ProductTable';
import ViewToggle from '../components/ViewToggle';
import Pagination from '../components/Pagination';
import ItemsPerPageSelector from '../components/ItemsPerPageSelector';
import { useProducts } from '../hooks/useProducts';
import { usePagination } from '../hooks/usePagination';
import { useSorting } from '../hooks/useSorting';
import { useProductFilters } from '../hooks/useProductFilters';
import { Loader, AlertCircle } from 'lucide-react';
import AddToCartModal from '../components/AddToCartModal';
import { Product, ProductQueryParams } from '../types';
import { useCart } from '../hooks/useCart';
import { useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/productService';
import { useAuth } from '../context/AuthContext';

const ProductListingPage = () => {
  const {
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
    hasActiveFilters,
    companies,
    categories,
    brands,
    sizes
  } = useProductFilters();
  const { isAdmin } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>(isAdmin ? 'table' : 'grid');
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const {
    sortColumn,
    sortDirection,
    handleSort
  } = useSorting();

  const productQueryParams = useMemo(() => ({
    search: searchTerm,
    company: selectedCompany,
    category: selectedCategory,
    brand: selectedBrand,
    size: selectedSize,
    inStockOnly: showInStockOnly,
    sortColumn,
    sortDirection,
    page: currentPage,
    limit: itemsPerPage,
  }), [searchTerm, selectedCompany, selectedCategory, selectedBrand, selectedSize, showInStockOnly, sortColumn, sortDirection, currentPage, itemsPerPage]);


  const { products, totalCount, loading, error } = useProducts(productQueryParams);
  const { addToCart } = useCart();

  useEffect(() => {
    // If current page is empty but there are total results, reset to page 1
    if (!loading && products.length === 0 && totalCount > 0 && currentPage > 1) {
      setCurrentPage(1);
    }
  }, [products, totalCount, loading, currentPage]);

  const {
    goToPage
  } = usePagination({
    totalItems: totalCount,
    itemsPerPage,
    currentPage,
    onPageChange: setCurrentPage
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    const totalPages = Math.ceil(totalCount / itemsPerPage);
    const nextPage = currentPage + 1;

    if (nextPage <= totalPages) {
      const nextQueryParams: ProductQueryParams = {
        ...productQueryParams,
        page: nextPage,
      };
      queryClient.prefetchQuery({
        queryKey: ['products', nextQueryParams],
        queryFn: () => productService.getProducts(nextQueryParams),
      });
    }
  }, [currentPage, itemsPerPage, totalCount, productQueryParams, queryClient]);

  const handleOrderClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleAddToCart = (product: Product, quantity: number, itemsPerPack?: string, specialInstructions?: string) => {
    addToCart(product, quantity, itemsPerPack, specialInstructions);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Search and Filter Section */}
      <div className="mb-8">
        <FilterAndSearchArea
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          companies={companies}
          categories={categories}
          brands={brands}
          sizes={sizes}
          selectedCompany={selectedCompany}
          selectedCategory={selectedCategory}
          selectedBrand={selectedBrand}
          selectedSize={selectedSize}
          showInStockOnly={showInStockOnly}
          onCompanyChange={setSelectedCompany}
          onCategoryChange={setSelectedCategory}
          onBrandChange={setSelectedBrand}
          onSizeChange={setSelectedSize}
          onToggleInStockOnly={setShowInStockOnly}
          showMobileFilters={showMobileFilters}
          onToggleMobileFilters={setShowMobileFilters}
        />
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Products ({totalCount})
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
      <div className="relative">
        {error ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
            <h3 className="text-lg font-medium text-red-900 mb-2">Error: {error}</h3>
            <p className="text-gray-500 mb-4">
              Please try again later.
            </p>
          </div>
        ) : (
          <>
            {products && products.length > 0 ? (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
                    {products.map(item => (
                      <ProductCard key={`${item.id}-${item.variant.id}`} product={item} onOrderClick={handleOrderClick} />
                    ))}
                  </div>
                ) : (
                  <div className="mb-8">
                    <ProductTable
                      products={products}
                      sortColumn={sortColumn}
                      sortDirection={sortDirection}
                      onSort={handleSort}
                      onOrderClick={handleOrderClick}
                    />
                  </div>
                )}

                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(totalCount / itemsPerPage)}
                  onPageChange={goToPage}
                  totalItems={totalCount}
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
            {loading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                <div className="flex items-center space-x-2 text-blue-600">
                  <Loader className="h-6 w-6 animate-spin" />
                  <span>Loading products...</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <AddToCartModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddToCart={handleAddToCart}
      />
    </main>
  );
};

export default ProductListingPage;