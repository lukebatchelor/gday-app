import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();
import { createConnection } from 'typeorm';
import express from 'express';
import pino from 'pino';

import middleware from './routes/middleware';
import routes from './routes';
import runStartupTasks from './startup';

const logger = pino();

async function main() {
  const app = express();

  // Add top level middleware
  middleware.configure(app);

  // Setup all API routes
  routes.configure(app);

  middleware.configureErrorMiddleware(app);

  const port = process.env.PORT || 9000;
  try {
    await createConnection();
    app.listen(port, async () => {
      logger.info(`✅ Listening on port ${port}`);
      await runStartupTasks();
      logger.info('Startup tasks done');
    });
  } catch (error) {
    logger.error('Uncaught error: ', error);
  }
}

main().catch((error: any) => {
  logger.error('Fatal error occured: ', error);
});
