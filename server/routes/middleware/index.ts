import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
const session = require('express-session');
import Redis from 'ioredis';
const redisStore = require('connect-redis')(session);

import { requestLoggerMiddleware } from './request-logging-middlware';
import { errorMiddleware } from './error-middleware';

function configure(app: Application) {
  // Helmet for sane default security headers.
  app.use(helmet());
  app.use(cors());
  app.use(requestLoggerMiddleware());
  app.use(express.json());
}

function configureErrorMiddleware(app: Application) {
  app.use(errorMiddleware);
}

function configureSessionMiddleware(app: Application) {
  const store = new redisStore({ client: new Redis(process.env.REDIS_URL) });
  app.use(
    session({
      name: 'gday-session',
      store,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30, // 1 month
        httpOnly: true,
        sameSite: 'lax', // csrf
        secure: false, // TODO set to secure based on NODE_ENV
      },
      saveUninitialized: false,
      secret: process.env.SESSION_HMAC_KEY,
      resave: false,
    })
  );
}

export default {
  configure,
  configureErrorMiddleware,
  configureSessionMiddleware,
};
