import { Application } from 'express';
import usersRoutes from './users-routes';

function configure(app: Application) {
  app.use('/api/users', usersRoutes);
}

export default {
  configure,
};
