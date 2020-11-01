import { Application } from 'express';
import uploadRoutes from './upload-routes';
import mediaRoutes from './media-routes';
import usersRoutes from './users-routes';
import conversationRoutes from './conversation-routes';

function configure(app: Application) {
  app.use('/media', mediaRoutes);
  app.use('/api/upload', uploadRoutes);
  app.use('/api/users', usersRoutes);
  app.use('/api/conversations', conversationRoutes);
}

export default {
  configure,
};
