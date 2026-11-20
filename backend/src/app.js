import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { apiLimiter } from './middleware/rateLimit.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import routes from './routes/index.js';
import { config } from './config/env.js';

const app = express();

// Security HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// Hosting platforms (Vercel, Render, Railway) put the app behind a proxy.
// Without this, express-rate-limit rejects requests that carry X-Forwarded-For.
app.set('trust proxy', 1);

// CORS Configuration
app.use(cors({
  origin: true, // Allow all origins for the research API
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// General Rate Limiter
app.use('/api', apiLimiter);

// Mount API routes
app.use('/api', routes);

// Root info and health endpoint directly at base URL (/)
app.get('/', (req, res) => {
  res.json({
    ok: true,
    status: 'online',
    service: 'Forty Years of Fees API — Greenwich University',
    version: '1.0.0',
    initiative: 'Journey 40',
    timestamp: new Date().toISOString(),
  });
});

// Also support /health directly
app.get('/health', (req, res) => {
  res.json({
    ok: true,
    status: 'online',
    service: 'Forty Years of Fees API — Greenwich University',
    version: '1.0.0',
    initiative: 'Journey 40',
    timestamp: new Date().toISOString(),
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Error Handler
app.use(errorHandler);

export default app;
