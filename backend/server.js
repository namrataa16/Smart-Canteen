import express from 'express';
import dotenv from 'dotenv';

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err);
});
import cors from 'cors';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import foodItemRoutes from './routes/foodItemRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cartRoutes from './routes/cartRoutes.js';

// Load env vars
dotenv.config();

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', foodItemRoutes);
app.use('/api', orderRoutes);
app.use('/api/cart', cartRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('Smart Canteen API is running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
