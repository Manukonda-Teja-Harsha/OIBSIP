const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./utils/db');
const { startStockMonitoring } = require('./utils/stockMonitoring');
const authRoutes = require('./routes/authRoutes');
const pizzaRoutes = require('./routes/pizzaRoutes');
const cartRoutes = require('./routes/cartRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');

dotenv.config();
const app = express();
app.use(express.json());
// Allow frontend origins (supports default 3000 and dev server on 3001)
const allowedOrigins = [process.env.CLIENT_URL || 'http://localhost:3000', process.env.CLIENT_URL_ALT || 'http://localhost:3001'];
app.use(cors({
  origin: (origin, callback) => {
    // allow non-browser requests (e.g., Postman) when origin is undefined
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
    return callback(new Error('CORS policy: This origin is not allowed.'));
  }
}));

connectDB();

app.get('/', (req, res) => {
  res.send('<h1>Pizza Delivery Backend</h1><p>Use the API routes under <code>/api</code>.</p>');
});

app.use('/api/auth', authRoutes);
app.use('/api/pizzas', pizzaRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/inventory', inventoryRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Start stock monitoring on server startup
  startStockMonitoring();
});
