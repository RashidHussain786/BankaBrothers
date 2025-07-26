const express = require('express');
const cors = require('cors');

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Use API routes
app.use('/api/products', productRoutes);
app.use('/api/order', orderRoutes);

app.get('/', (req, res) => {
  res.send('Banka Brother Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});