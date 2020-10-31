import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import pino from 'pino';

const logger = pino();

async function main() {
  const app = express();

  app.get('/', (req, res) => {
    res.send('here');
  });

  const port = process.env.PORT || 9000;
  try {
    app.listen(port, () => {
      logger.info(`✅ Listening on port ${port}`);
    });
  } catch (err) {
    logger.error(err, 'error');
  }
}

main().catch((error: Error) => {
  logger.error(error, 'Fatal error occured: ');
});
