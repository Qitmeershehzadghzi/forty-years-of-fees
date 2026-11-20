import app from '../backend/src/app.js';
import { connectDB } from '../backend/src/config/db.js';

// Vercel serverless entry point for monorepo root deployment
export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Database connection failed',
      error: error.message,
    });
    return;
  }

  app(req, res);
}
