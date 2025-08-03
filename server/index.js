const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const importRoutes = require('./routes/importRoutes');
const customerRoutes = require('./routes/customerRoutes');

const app = express();
const PORT = 3001;

const allowedOrigin =
  process.env.NODE_ENV === 'production'
    ? 'https://bankabrothers.netlify.app'
    : process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(
  cors({
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
    credentials: true,
  })
);

app.use(express.json());

// Use API routes
app.use('/api/products', productRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/import', importRoutes);
app.use('/api/customers', customerRoutes);

app.get('/', (req, res) => {
  res.send('Banka Brother Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});