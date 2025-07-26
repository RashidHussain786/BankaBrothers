const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const PRODUCTS_PATH = path.join(__dirname, '../data/products.json');

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

exports.importProducts = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    const results = [];
    let error = null;

    fs.createReadStream(req.file.path)
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
            fs.unlinkSync(req.file.path); // Remove temp file
            if (error) {
                return res.status(400).json({ message: error });
            }
            // Overwrite products.json
            fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(results, null, 2));
            res.json({ message: 'Products imported successfully.' });
        })
        .on('error', (err) => {
            fs.unlinkSync(req.file.path);
            res.status(500).json({ message: 'Failed to process CSV file.' });
        });
};
