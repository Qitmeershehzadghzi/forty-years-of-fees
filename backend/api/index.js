import app from '../src/app.js';
import { connectDB } from '../src/config/db.js';

// Vercel serverless entry point: every request is rewritten here by vercel.json.
// The MongoDB connection is cached per warm container inside connectDB().
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
