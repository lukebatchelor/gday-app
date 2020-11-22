import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();
import createConnection from './entity/connection';
import express from 'express';
import pino from 'pino';
import http from 'http';

import middleware from './routes/middleware';
import routes from './routes';
import runStartupTasks from './startup';
import { configureSockets } from './sockets/sockets';

const logger = pino();

async function main() {
  const app = express();
  const server = http.createServer(app);

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

    // Start socket server
    configureSockets(server);

    server.listen(port, async () => {
      logger.info(`✅ Listening on port ${port}`);
      await runStartupTasks();
    });
  } catch (error) {
    console.log(error);
    logger.error(error, 'Uncaught error');
  }
}

main().catch((error: any) => {
  logger.error(error, 'Fatal error occured');
});
