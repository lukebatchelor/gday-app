import { Application } from 'express';
import usersRoutes from './users-routes';
import conversationRoutes from './conversation-routes';

function configure(app: Application) {
  app.use('/api/users', usersRoutes);
  app.use('/api/conversations', conversationRoutes);
}

export default {
  configure,
};
