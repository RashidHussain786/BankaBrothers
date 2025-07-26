const express = require('express');
const cors = require('cors');

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const importRoutes = require('./routes/importRoutes');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Use API routes
app.use('/api/products', productRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', importRoutes);

app.get('/', (req, res) => {
  res.send('Banka Brother Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});