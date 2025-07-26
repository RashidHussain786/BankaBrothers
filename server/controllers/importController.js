const fs = require('fs');
const productService = require('../services/productService');

exports.importProducts = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    try {
        const message = await productService.importProductsFromCSV(req.file.path);
        fs.unlinkSync(req.file.path); // Remove temp file
        res.json({ message });
    } catch (error) {
        fs.unlinkSync(req.file.path);
        res.status(400).json({ message: error.message });
    }
};
