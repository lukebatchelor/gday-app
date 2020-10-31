import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();
import createConnection from './entity/connection';
import express from 'express';
import pino from 'pino';

import middleware from './routes/middleware';
import routes from './routes';
import runStartupTasks from './startup';

const logger = pino();

async function main() {
  const app = express();

  const port = process.env.PORT || 9000;
  try {
    // Connect to database
    await createConnection();
    // Add top level middleware
    middleware.configure(app);
    middleware.configureSessionMiddleware(app);
    // Setup all API routes
    routes.configure(app);

    middleware.configureErrorMiddleware(app);

    app.listen(port, async () => {
      logger.info(`✅ Listening on port ${port}`);
      await runStartupTasks();
    });
  } catch (error) {
    logger.error('Uncaught error: ', error);
  }
}

main().catch((error: any) => {
  logger.error('Fatal error occured: ', error);
});
