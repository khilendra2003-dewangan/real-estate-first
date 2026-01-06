import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createClient } from 'redis';
import connectDB from './src/config/db.js';

// Import Routes
import userRouter from './src/routes/userRouter.js';
import adminRouter from './src/routes/adminRouter.js';
import propertyRouter from './src/routes/propertyRouter.js';
import categoryRouter from './src/routes/categoryRouter.js';
import wishlistRouter from './src/routes/wishlistRouter.js';
import inquiryRouter from './src/routes/inquiryRouter.js';
import visitRouter from './src/routes/visitRouter.js';
import locationRouter from './src/routes/locationRouter.js';

dotenv.config();

const app = express();

// Redis Client Setup (Optional - app works without Redis)
let redisClient = null;
let redisConnected = false;

const initRedis = async () => {
    try {
        redisClient = createClient({
            url: process.env.REDIS_URL || 'redis://localhost:6379'
        });

        redisClient.on('error', (err) => {
            if (redisConnected) console.log('Redis Client Error', err.message);
        });

        await redisClient.connect();
        redisConnected = true;
        console.log('✅ Redis connected successfully');
    } catch (error) {
        console.log('⚠️  Redis not available - running without rate limiting');
        redisClient = null;
        redisConnected = false;
    }
};

export { redisClient, redisConnected };

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health Check Route
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Real Estate API is running',
        redis: redisConnected ? 'connected' : 'not available',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/property', propertyRouter);
app.use('/api/category', categoryRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/inquiry', inquiryRouter);
app.use('/api/visit', visitRouter);
app.use('/api/location', locationRouter);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // Try Redis but don't fail if not available
        await initRedis();

        // MongoDB is required
        await connectDB();

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📍 Health check: http://localhost:${PORT}/health`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();
