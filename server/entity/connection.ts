import { createConnection } from 'typeorm';
import pino from 'pino';

const logger = pino();

export default async () => {
  logger.info('Connecting to database');
  try {
    const connection = await createConnection();
    const unrunMigrations = await connection.showMigrations();
    if (unrunMigrations) {
      throw new Error(
        `There are unrun migrations in ${process.env.TYPEORM_MIGRATIONS_DIR}. run yarn db:migrations:run`
      );
    }
    return connection;
  } catch (error) {
    logger.error('Failed to connect to database', error);
    throw error;
  }
};
