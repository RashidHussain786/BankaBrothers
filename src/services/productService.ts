import { Product, ProductQueryParams, ProductServiceResponse } from '../types';

let allProducts: Product[] = [];

const getStockStatus = (stock: number): number => {
  if (stock === 0) return 0; // Out of Stock
  if (stock <= 10) return 1; // Low Stock
  return 2; // In Stock
};

const parseUnitSize = (unitSize: string): number => {
  const match = unitSize.match(/^(\d+(?:\.\d+)?)(.*)/);
  if (!match) return 0;

  const value = parseFloat(match[1]);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case 'kg':
      return value * 1000;
    case 'g':
    case '':
      return value;
    default:
      return value;
  }
};

export const productService = {
  async getProducts(params: ProductQueryParams = {}): Promise<ProductServiceResponse> {
    if (allProducts.length === 0) {
      const response = await fetch('/products.json');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      allProducts = await response.json();
    }

    let baseFilteredProducts = [...allProducts];

    // Apply search and in-stock filters first to narrow down the base for cascading filters
    if (params.search) {
      const searchTermLower = params.search.toLowerCase();
      baseFilteredProducts = baseFilteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTermLower) ||
        product.company.toLowerCase().includes(searchTermLower)
      );
    }
    if (params.inStockOnly) {
      baseFilteredProducts = baseFilteredProducts.filter(product => product.stock > 0);
    }

    // Dynamically calculate filter options based on current selections
    const companies = Array.from(new Set(baseFilteredProducts.map(product => product.company))).sort();

    let productsForCategoryFilter = [...baseFilteredProducts];
    if (params.company) {
      productsForCategoryFilter = productsForCategoryFilter.filter(product => product.company === params.company);
    }
    const categories = Array.from(new Set(productsForCategoryFilter.map(product => product.category))).sort();

    let productsForBrandFilter = [...productsForCategoryFilter];
    if (params.category) {
      productsForBrandFilter = productsForBrandFilter.filter(product => product.category === params.category);
    }
    const brands = Array.from(new Set(productsForBrandFilter.map(product => product.brand))).sort();

    let productsForSizeFilter = [...productsForBrandFilter];
    if (params.brand) {
      productsForSizeFilter = productsForSizeFilter.filter(product => product.brand === params.brand);
    }
    const sizes = Array.from(new Set(productsForSizeFilter.map(product => product.size))).sort();

    // Final filtering for displayed products
    let filteredProducts = [...baseFilteredProducts];
    if (params.company) {
      filteredProducts = filteredProducts.filter(product => product.company === params.company);
    }
    if (params.category) {
      filteredProducts = filteredProducts.filter(product => product.category === params.category);
    }
    if (params.brand) {
      filteredProducts = filteredProducts.filter(product => product.brand === params.brand);
    }
    if (params.size) {
      filteredProducts = filteredProducts.filter(product => product.size === params.size);
    }

    const totalCount = filteredProducts.length;

    // Apply sorting
    if (params.sortColumn && params.sortDirection) {
      filteredProducts.sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;

        switch (params.sortColumn) {
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case 'company':
            aValue = a.company.toLowerCase();
            bValue = b.company.toLowerCase();
            break;
          case 'category':
            aValue = a.category.toLowerCase();
            bValue = b.category.toLowerCase();
            break;
          case 'unitSize':
            aValue = parseUnitSize(a.unitSize);
            bValue = parseUnitSize(b.unitSize);
            break;
          case 'stock':
            aValue = a.stock;
            bValue = b.stock;
            break;
          case 'status':
            aValue = getStockStatus(a.stock);
            bValue = getStockStatus(b.stock);
            break;
          default:
            return 0;
        }

        if (aValue < bValue) {
          return params.sortDirection === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return params.sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    // Apply pagination
    const page = params.page || 1;
    const limit = params.limit || 10; // Default limit
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filteredProducts.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      totalCount,
      companies,
      categories,
      brands,
      sizes,
    };
  },
};
