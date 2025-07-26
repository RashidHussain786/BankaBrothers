const productService = require('../services/productService');

exports.getAllProducts = (req, res) => {
  const { search, company, category, brand, size, inStockOnly, sortColumn, sortDirection, page, limit } = req.query;
  const productsData = productService.findProducts({ search, company, category, brand, size, inStockOnly, sortColumn, sortDirection, page, limit });
  res.json(productsData);
};

exports.getProductById = (req, res) => {
  const productId = parseInt(req.params.id);
  const product = productService.findProductById(productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).send('Product not found');
  }
};

exports.getCompanies = (req, res) => {
  const companies = productService.getUniqueCompanies();
  res.json(companies);
};

exports.getCategories = (req, res) => {
  const { company } = req.query;
  const categories = productService.getUniqueCategories(company);
  res.json(categories);
};

exports.getBrands = (req, res) => {
  const { company, category } = req.query;
  const brands = productService.getUniqueBrands(company, category);
  res.json(brands);
};

exports.getSizes = (req, res) => {
  const { company, category, brand } = req.query;
  const sizes = productService.getUniqueSizes(company, category, brand);
  res.json(sizes);
};

exports.getProductsByStockStatus = (req, res) => {
  const status = req.query.status;
  const products = productService.filterProductsByStockStatus(status);
  res.json(products);
};