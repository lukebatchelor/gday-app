import crypto from 'crypto';
import express from 'express';
import pino from 'pino';
import { difference } from 'underscore';
import { In, getConnection } from 'typeorm';
import { indexBy } from 'underscore';

import { wrapExpressPromise, assertFound } from '../util';
import { User } from '../entity/User';
import { ServiceError } from '../error/service-error';
import { loggedInMiddleware } from './middleware/logged-in-middleware';
import { Conversation } from '../entity/Conversation';
import { Participant } from '../entity/Participant';
import { Message } from '../entity/Message';

const logger = pino();

// Hosted at /api/users
const conversationRoutes = express.Router();

// Create conversation
conversationRoutes.post(
  '/',
  loggedInMiddleware,
  wrapExpressPromise<CreateConversationRequest, CreateConversationResponse>(async (req, res) => {
    const userId = req.session.userId;
    const { users } = req.body;
    if (users.length < 1) {
      throw new ServiceError('Invalid users list', 400);
    }
    if (users.includes(userId)) {
      throw new ServiceError('Cannot start conversation with yourself', 400);
    }
    const allUsers = [userId, ...users];

    // Check all users exist
    const foundUsers = await User.find({ id: In([userId, ...users]) });
    const missingUsers = difference(
      allUsers,
      foundUsers.map((u) => u.id)
    );
    if (missingUsers.length > 0) {
      throw new ServiceError(`Users not found [${missingUsers.join(',')}]`, 404);
    }

    // Create new conversation and add each user as a particpants in one transation
    const conversationId = `C${crypto.randomBytes(12).toString('hex')}`.substr(0, 12);
    await getConnection().transaction(async (tm) => {
      const conversation = tm.create(Conversation, { id: conversationId });
      tm.save(conversation);

      for (const user of allUsers) {
        const userEntity = tm.create(Participant, { user, conversation: conversationId });
        tm.save(userEntity);
      }
    });
    return {
      conversation: {
        id: conversationId,
      },
    };
  })
);

conversationRoutes.get(
  '/',
  loggedInMiddleware,
  wrapExpressPromise<GetConversationsRequest, GetConversationsResponse>(async (req, res) => {
    const { userId } = req.session;
    const conversationsParticipatedIn = await Participant.find({ user: userId });
    const conversations = await Conversation.find({ id: In(conversationsParticipatedIn.map((c) => c.conversation)) });
    const messages = await Message.find({ id: In(conversations.map((c) => c.lastMessage)) });
    const conversationToMessage = indexBy(messages, 'conversation');
    return {
      conversations: conversationsParticipatedIn.map((p) => ({
        id: p.conversation,
        lastMessage: mapMessage(conversationToMessage[p.conversation]),
      })),
    };
  })
);

conversationRoutes.post(
  '/:id/sendmessage',
  loggedInMiddleware,
  wrapExpressPromise<SendMessageToConversationRequest, SendMessageToConversationResponse>(async (req, res) => {
    const { userId } = req.session;
    const { id: conversationId } = req.params;
    const { content } = req.body;
    const participants = await Participant.find({ conversation: conversationId });
    if (!participants.map((p) => p.user).includes(userId)) {
      throw new ServiceError(`User ${userId} not in conversation ${conversationId}`, 400);
    }
    const conversation = await Conversation.findOne({ id: conversationId });
    assertFound(conversation);

    const message = Message.create({ sendingUser: req.session.userId, conversation: conversationId, content });
    await message.save();
    conversation.lastMessage = message.id;
    conversation.save();
    return {
      conversation: {
        id: conversationId,
        lastMessage: mapMessage(message),
      },
    };
  })
);

conversationRoutes.get(
  '/:id/messages',
  loggedInMiddleware,
  wrapExpressPromise<GetMessagesForConversationRequest, GetMessagesForConversationResponse>(async (req, res) => {
    const { id: conversationId } = req.params;
    const messages = (await Message.find({ conversation: conversationId })).map(mapMessage);
    return { messages };
  })
);

function mapMessage(message?: Message): IMessage {
  if (!message) {
    return null;
  }
  console.log(message);
  return {
    sendingUser: message.sendingUser,
    content: message.content,
    timestamp: message.createdAt.getTime(),
  };
}

export default conversationRoutes;
