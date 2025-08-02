const productService = require('../services/productService');

exports.getAllProducts = async (req, res) => {
  const { search, company, category, brand, size, inStockOnly, sortColumn, sortDirection, page, limit } = req.query;
  try {
    const productsData = await productService.findProducts({ search, company, category, brand, size, inStockOnly, sortColumn, sortDirection, page, limit });
    res.json(productsData);
  } catch (error) {
    console.error('Error getting all products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

exports.getProductById = async (req, res) => {
  const productId = parseInt(req.params.id);
  try {
    const product = await productService.findProductById(productId);
    if (product) {
      res.json(product);
    } else {
      res.status(404).send('Product not found');
    }
  } catch (error) {
    console.error('Error getting product by ID:', error);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
};

exports.getCompanies = async (req, res) => {
  try {
    const companies = await productService.getUniqueCompanies();
    res.json(companies);
  } catch (error) {
    console.error('Error getting unique companies:', error);
    res.status(500).json({ message: 'Failed to fetch companies' });
  }
};

exports.getCategories = async (req, res) => {
  const { company } = req.query;
  try {
    const categories = await productService.getUniqueCategories(company);
    res.json(categories);
  } catch (error) {
    console.error('Error getting unique categories:', error);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
};

exports.getBrands = async (req, res) => {
  const { company, category } = req.query;
  try {
    const brands = await productService.getUniqueBrands(company, category);
    res.json(brands);
  } catch (error) {
    console.error('Error getting unique brands:', error);
    res.status(500).json({ message: 'Failed to fetch brands' });
  }
};

exports.getSizes = async (req, res) => {
  const { company, category, brand } = req.query;
  try {
    const sizes = await productService.getUniqueSizes(company, category, brand);
    res.json(sizes);
  } catch (error) {
    console.error('Error getting unique sizes:', error);
    res.status(500).json({ message: 'Failed to fetch sizes' });
  }
};

exports.getProductsByStockStatus = async (req, res) => {
  const status = req.query.status;
  try {
    const products = await productService.filterProductsByStockStatus(status);
    res.json(products);
  } catch (error) {
    console.error('Error getting products by stock status:', error);
    res.status(500).json({ message: 'Failed to fetch products by stock status' });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const product = await productService.addProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};