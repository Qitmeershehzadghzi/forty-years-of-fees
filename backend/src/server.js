import app from './app.js';
import { connectDB } from './config/db.js';
import { config } from './config/env.js';

async function startServer() {
  try {
    await connectDB();
    const port = config.port;

    const server = app.listen(port, () => {
      console.log(`=======================================================`);
      console.log(`  Forty Years of Fees — Backend API Server`);
      console.log(`  Greenwich University, Karachi (Journey 40)`);
      console.log(`  Listening on: http://localhost:${port}`);
      console.log(`  Environment: ${config.nodeEnv}`);
      console.log(`=======================================================`);
    });

    const shutdown = async (signal) => {
      console.log(`\nReceived ${signal}. Shutting down gracefully...`);
      server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
