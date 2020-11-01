import express from 'express';
import pino from 'pino';

import { userInConversationMiddleware } from './middleware/user-in-conversation-middleware';

const logger = pino();

// Hosted at /media
const mediaRoutes = express.Router();

// Serve all avatar media publically
mediaRoutes.use('/avatar', express.static('./uploads/avatar'));

// Serve conversation uploads only if user belongs to conversation
mediaRoutes.use('/conversation/:conversationId', userInConversationMiddleware, (req, res, next) => {
  const { conversationId } = req.params;
  express.static(`./uploads/conversation/${conversationId}/`)(req, res, next);
});

export default mediaRoutes;
