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
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          await prisma.$transaction(async (tx) => {
            for (const row of results) {
              const product = await tx.product.upsert({
                where: { name: row.name },
                update: {
                  company: row.company,
                  category: row.category,
                  brand: row.brand,
                },
                create: {
                  name: row.name,
                  company: row.company,
                  category: row.category,
                  brand: row.brand,
                },
              });

              const existingVariant = await tx.productVariant.findFirst({
                where: {
                  productId: product.id,
                  unitSize: row.unit_size,
                },
              });

              if (existingVariant) {
                await tx.productVariant.update({
                  where: { id: existingVariant.id },
                  data: {
                    price: parseFloat(row.price),
                    stockQuantity: parseInt(row.stock_quantity),
                  },
                });
              } else {
                await tx.productVariant.create({
                  data: {
                    productId: product.id,
                    unitSize: row.unit_size,
                    price: parseFloat(row.price),
                    stockQuantity: parseInt(row.stock_quantity),
                  },
                });
              }
            }
          });
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

  const whereVariant = {};
  const whereProduct = {};

  if (search) {
    whereProduct.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { company: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (company) {
    whereProduct.company = company;
  }
  if (category) {
    whereProduct.category = category;
  }
  if (brand) {
    whereProduct.brand = brand;
  }

  if (size) {
    whereVariant.unitSize = size;
  }
  if (inStockOnly === 'true') {
    whereVariant.stockQuantity = { gt: 0 };
  }

  // Combine product and variant filters
  const finalWhere = {
    ...whereVariant,
    product: whereProduct,
  };

  const orderBy = {};
  if (sortColumn && sortDirection) {
    // Sort by variant fields if applicable, otherwise by product fields
    if (['unitSize', 'price', 'stockQuantity'].includes(sortColumn)) {
      orderBy[sortColumn] = sortDirection;
    } else if (['name', 'company', 'category', 'brand'].includes(sortColumn)) {
      orderBy.product = { [sortColumn]: sortDirection };
    }
  }

  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const skip = (pageNum - 1) * limitNum;
  const take = limitNum;

  const [variants, totalCount] = await prisma.$transaction([
    prisma.productVariant.findMany({
      where: finalWhere,
      orderBy,
      skip,
      take,
      include: {
        product: true,
      },
    }),
    prisma.productVariant.count({
      where: finalWhere,
    }),
  ]);

  // Reformat data to match frontend's expected Product & Variant structure
  const productsWithVariants = variants.map(variant => ({
    ...variant.product,
    variant: {
      id: variant.id,
      productId: variant.productId,
      unitSize: variant.unitSize,
      price: variant.price,
      stockQuantity: variant.stockQuantity,
    },
  }));

  return {
    data: productsWithVariants,
    totalCount,
  };
};

exports.findProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
    include: {
      variants: true,
    },
  });
  return product;
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
  const whereProduct = {};
  if (company) {
    whereProduct.company = company;
  }
  if (category) {
    whereProduct.category = category;
  }
  if (brand) {
    whereProduct.brand = brand;
  }

  const where = {};
  if (Object.keys(whereProduct).length > 0) {
    where.product = whereProduct;
  }

  const sizes = await prisma.productVariant.findMany({
    distinct: ['unitSize'],
    select: { unitSize: true },
    where: { ...where }
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

  const productVariants = await prisma.productVariant.findMany({
    where,
    include: {
      product: true,
    },
  });

  // Group variants by product to return products with their variants
  const productsMap = new Map();
  productVariants.forEach(variant => {
    if (!productsMap.has(variant.productId)) {
      productsMap.set(variant.productId, { ...variant.product, variants: [] });
    }
    productsMap.get(variant.productId).variants.push(variant);
  });

  return Array.from(productsMap.values());
};