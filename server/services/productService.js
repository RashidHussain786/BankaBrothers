const csv = require('csv-parser');
const fs = require('fs');
const prisma = require('../config/prisma'); // Import the Prisma client

// Helper function to determine stock status (can be moved to a utility if used elsewhere)
const getStockStatus = (stockQuantity) => {
  if (stockQuantity === 0) return 0; // Out of Stock
  if (stockQuantity <= 10) return 1; // Low Stock
  return 2; // In Stock
};

// Helper function to parse unit size (can be moved to a utility if used elsewhere)
const parseUnitSize = (unitSize) => {
  if (!unitSize) return 0;
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
        // Basic validation and type conversion
        const processedData = {
          id: parseInt(data.id), // Assuming ID is provided in CSV for upsert
          name: data.name,
          company: data.company || null,
          category: data.category || null,
          brand: data.brand || null,
          unitSize: data.unitSize || null,
          itemsPerPack: data.itemsPerPack ? parseInt(data.itemsPerPack) : null,
          image: data.image || null,
          price: parseFloat(data.price),
          stockQuantity: data.stockQuantity ? parseInt(data.stockQuantity) : null,
        };
        results.push(processedData);
      })
      .on('end', async () => {
        if (error) {
          reject(new Error(error));
          return;
        }
        try {
          // Use a transaction to ensure all or nothing
          await prisma.$transaction(
            results.map((productData) =>
              prisma.product.upsert({
                where: { name: productData.name }, // Assuming name is unique for upsert
                update: productData,
                create: productData,
              })
            )
          );
          resolve('Products imported successfully.');
        } catch (dbError) {
          console.error('Database error during CSV import:', dbError);
          reject(new Error('Failed to import products to database.'));
        }
      })
      .on('error', (err) => {
        reject(new Error('Failed to process CSV file.'));
      });
  });
};

exports.findProducts = async (params) => {
  const { search, company, category, brand, size, inStockOnly, sortColumn, sortDirection, page, limit } = params;

  const where = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { company: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (company) {
    where.company = company;
  }
  if (category) {
    where.category = category;
  }
  if (brand) {
    where.brand = brand;
  }
  // 'size' mapping to 'unitSize' or other fields might need more specific logic based on your data
  // For now, assuming 'size' refers to unitSize
  if (size) {
    where.unitSize = size;
  }
  if (inStockOnly === 'true') {
    where.stockQuantity = { gt: 0 };
  }

  const orderBy = {};
  if (sortColumn && sortDirection) {
    // Handle specific sorting logic for unitSize and stockStatus if needed
    // For now, direct mapping for simple columns
    if (sortColumn === 'unitSize') {
      // Sorting by parsed unit size is complex in Prisma directly.
      // Might need raw query or sort in application after fetching.
      // For simplicity, sorting by string for now.
      orderBy.unitSize = sortDirection;
    } else if (sortColumn === 'status') {
      // Sorting by status (derived from stockQuantity) is also complex directly.
      // Might need raw query or sort in application after fetching.
      orderBy.stockQuantity = sortDirection; // Sort by stockQuantity as a proxy
    } else {
      orderBy[sortColumn] = sortDirection;
    }
  }

  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const skip = (pageNum - 1) * limitNum;
  const take = limitNum;

  const [products, totalCount] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take,
    }),
    prisma.product.count({ where }),
  ]);

  // Add isAvailable and stockStatus after fetching if not directly in DB
  const processedProducts = products.map(p => ({
    ...p,
    isAvailable: p.stockQuantity > 0,
    stockStatus: getStockStatus(p.stockQuantity), // Add stockStatus
  }));

  return {
    data: processedProducts,
    totalCount,
  };
};

exports.findProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
  });
  if (product) {
    return { ...product, isAvailable: product.stockQuantity > 0 };
  }
  return null;
};

exports.getUniqueCompanies = async () => {
  const companies = await prisma.product.findMany({
    distinct: ['company'],
    select: { company: true },
    where: { company: { not: null } },
  });
  return companies.map(c => c.company).sort();
};

exports.getUniqueCategories = async (company) => {
  const where = {};
  if (company) {
    where.company = company;
  }
  const categories = await prisma.product.findMany({
    distinct: ['category'],
    select: { category: true },
    where: { ...where, category: { not: null } },
  });
  return categories.map(c => c.category).sort();
};

exports.getUniqueBrands = async (company, category) => {
  const where = {};
  if (company) {
    where.company = company;
  }
  if (category) {
    where.category = category;
  }
  const brands = await prisma.product.findMany({
    distinct: ['brand'],
    select: { brand: true },
    where: { ...where, brand: { not: null } },
  });
  return brands.map(b => b.brand).sort();
};

exports.getUniqueSizes = async (company, category, brand) => {
  const where = {};
  if (company) {
    where.company = company;
  }
  if (category) {
    where.category = category;
  }
  if (brand) {
    where.brand = brand;
  }
  const sizes = await prisma.product.findMany({
    distinct: ['unitSize'],
    select: { unitSize: true },
    where: { ...where, unitSize: { not: null } },
  });
  return sizes.map(s => s.unitSize).sort();
};

exports.filterProductsByStockStatus = async (status) => {
  let where = {};
  if (status === 'in') {
    where.stockQuantity = { gt: 10 };
  }
  else if (status === 'low') {
    where.stockQuantity = { gt: 0, lte: 10 };
  }
  else if (status === 'out') {
    where.stockQuantity = { equals: 0 };
  }

  const products = await prisma.product.findMany({
    where,
  });

  return products.map(p => ({ ...p, isAvailable: p.stockQuantity > 0 }));
};