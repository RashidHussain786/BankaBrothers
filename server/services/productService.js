const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const productsFilePath = path.join(__dirname, '..', 'data', 'products.json');
let products = [];

const REQUIRED_FIELDS = [
  'id',
  'name',
  'company',
  'category',
  'brand',
  'unitSize',
  'size',
  'stockQuantity',
  'image',
];

// Load products data
try {
  const data = fs.readFileSync(productsFilePath, 'utf8');
  products = JSON.parse(data);
} catch (err) {
  console.error('Error reading products.json:', err);
}

const getStockStatus = (stockQuantity) => {
  if (stockQuantity === 0) return 0; // Out of Stock
  if (stockQuantity <= 10) return 1; // Low Stock
  return 2; // In Stock
};

const parseUnitSize = (unitSize) => {
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

exports.importProductsFromCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    let error = null;

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        // Validate required fields
        const missingFields = REQUIRED_FIELDS.filter(field => !(field in data));
        if (missingFields.length > 0) {
          error = `Missing required fields: ${missingFields.join(', ')}. CSV columns found: ${Object.keys(data).join(', ')}`;
          return;
        }
        // Convert types
        const processedData = {
          ...data,
          id: parseInt(data.id),
          stockQuantity: parseInt(data.stockQuantity)
        };
        results.push(processedData);
      })
      .on('end', () => {
        if (error) {
          reject(new Error(error));
          return;
        }
        // Overwrite products.json
        fs.writeFileSync(productsFilePath, JSON.stringify(results, null, 2));
        // Update in-memory products
        products = results;
        resolve('Products imported successfully.');
      })
      .on('error', (err) => {
        reject(new Error('Failed to process CSV file.'));
      });
  });
};

exports.findProducts = (params) => {
  let filteredProducts = [...products];

  // Dynamically add isAvailable
  filteredProducts = filteredProducts.map(p => ({
    ...p,
    isAvailable: p.stockQuantity > 0
  }));

  // Filtering
  const { search, company, category, brand, size, inStockOnly, sortColumn, sortDirection, page, limit } = params;

  if (search) {
    const searchTermLower = search.toLowerCase();
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(searchTermLower) ||
      product.company.toLowerCase().includes(searchTermLower)
    );
  }

  if (company) {
    filteredProducts = filteredProducts.filter(product => product.company === company);
  }

  if (category) {
    filteredProducts = filteredProducts.filter(product => product.category === category);
  }

  if (brand) {
    filteredProducts = filteredProducts.filter(product => product.brand === brand);
  }

  if (size) {
    filteredProducts = filteredProducts.filter(product => product.size === size);
  }

  if (inStockOnly === 'true') {
    filteredProducts = filteredProducts.filter(product => product.stockQuantity > 0);
  }

  // Sorting
  if (sortColumn && sortDirection) {
    filteredProducts.sort((a, b) => {
      let aValue;
      let bValue;

      switch (sortColumn) {
        case 'name':
        case 'company':
        case 'category':
        case 'brand':
        case 'size':
          aValue = a[sortColumn].toLowerCase();
          bValue = b[sortColumn].toLowerCase();
          break;
        case 'unitSize':
          aValue = parseUnitSize(a.unitSize);
          bValue = parseUnitSize(b.unitSize);
          break;
        case 'stockQuantity':
          aValue = a.stockQuantity;
          bValue = b.stockQuantity;
          break;
        case 'status':
          aValue = getStockStatus(a.stockQuantity);
          bValue = getStockStatus(b.stockQuantity);
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  // Pagination
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;

  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return {
    data: paginatedProducts,
    totalCount: filteredProducts.length,
  };
};

exports.findProductById = (id) => {
  const product = products.find(p => p.id === id);
  if (product) {
    return { ...product, isAvailable: product.stockQuantity > 0 };
  }
  return null;
};

exports.getUniqueCompanies = () => {
  return [...new Set(products.map(p => p.company))].sort();
};

exports.getUniqueCategories = (company) => {
  let filtered = products;
  if (company) {
    filtered = filtered.filter(p => p.company === company);
  }
  return [...new Set(filtered.map(p => p.category))].sort();
};

exports.getUniqueBrands = (company, category) => {
  let filtered = products;
  if (company) {
    filtered = filtered.filter(p => p.company === company);
  }
  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }
  return [...new Set(filtered.map(p => p.brand))].sort();
};

exports.getUniqueSizes = (company, category, brand) => {
  let filtered = products;
  if (company) {
    filtered = filtered.filter(p => p.company === company);
  }
  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }
  if (brand) {
    filtered = filtered.filter(p => p.brand === brand);
  }
  return [...new Set(filtered.map(p => p.size))].sort();
};

exports.filterProductsByStockStatus = (status) => {
  let filteredByStatus = [...products];

  if (status === 'in') {
    filteredByStatus = filteredByStatus.filter(p => p.stockQuantity > 10);
  } else if (status === 'low') {
    filteredByStatus = filteredByStatus.filter(p => p.stockQuantity > 0 && p.stockQuantity <= 10);
  } else if (status === 'out') {
    filteredByStatus = filteredByStatus.filter(p => p.stockQuantity === 0);
  }

  return filteredByStatus.map(p => ({ ...p, isAvailable: p.stockQuantity > 0 }));
};