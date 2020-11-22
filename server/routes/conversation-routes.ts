import crypto from 'crypto';
import express from 'express';
import pino from 'pino';
import { difference } from 'underscore';
import { In, getConnection, EntityManager } from 'typeorm';
import { indexBy } from 'underscore';

import { wrapExpressPromise, assertFound } from '../util';
import { User } from '../entity/User';
import { ServiceError } from '../error/service-error';
import { loggedInMiddleware } from './middleware/logged-in-middleware';
import { Conversation } from '../entity/Conversation';
import { Participant } from '../entity/Participant';
import { Message } from '../entity/Message';
import { sendNewMessageToUsers } from '../sockets/sockets';

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
    const userEntities = await getUsers(allUsers);

    // Create new conversation and add each user as a particpants in one transation
    const conversationId = `C${crypto.randomBytes(12).toString('hex')}`.substr(0, 12);
    const name = `Chat with ${userEntities
      .map((u) => u.displayName)
      .sort()
      .join(', ')}`;
    let conversation: Conversation;
    await getConnection().transaction(async (tm) => {
      conversation = tm.create(Conversation, { id: conversationId, name });
      await tm.save(conversation);

      for (const user of allUsers) {
        await createParticipant(user, conversationId, tm);
      }
    });
    return {
      conversation: mapConversation(conversation),
    };
  })
);

conversationRoutes.post(
  '/:id',
  loggedInMiddleware,
  wrapExpressPromise<AddUsersToConversationRequest, AddUsersToConversationResponse>(async (req, res) => {
    const { id: conversationId } = req.params;
    const { users } = req.body;
    const { userId } = req.session;

    //Check all users exist
    await getUsers(users);

    // Check logged in user is in coversation
    const participant = await Participant.findOne({ user: userId, conversation: conversationId });
    if (!participant) {
      throw new ServiceError(`User ${userId} not a member of conversation ${conversationId}`, 400);
    }
    const conversation = await Conversation.findOne({ id: conversationId });

    // Add users in one transaction
    await getConnection().transaction(async (tm) => {
      for (const user of users) {
        await createParticipant(user, conversationId, tm);
      }
    });

    return { conversation: mapConversation(conversation) };
  })
);

conversationRoutes.get(
  '/',
  loggedInMiddleware,
  wrapExpressPromise<GetConversationsRequest, GetConversationsResponse>(async (req, res) => {
    const { userId } = req.session;
    let conversationsParticipatedIn = await Participant.find({ user: userId });
    // Filter conversations to only ones containing set of users if query param passed in
    if (req.query.users) {
      const { users } = req.query;
      // Users to filter on is all users passed in plus plogged in user comma seperated in alphabetical order
      const userListToFilterOn = [...users.split(','), userId].sort().join(',');
      const allConversationIds = conversationsParticipatedIn.map((c) => c.conversation);
      conversationsParticipatedIn = await Participant.createQueryBuilder()
        .select('conversation, group_concat(user order by user asc) as users')
        .where('conversation IN (:...conversations)', { conversations: allConversationIds })
        .groupBy('conversation')
        .having('users = :users', { users: userListToFilterOn })
        .execute();
    }
    const conversations = await Conversation.find({ id: In(conversationsParticipatedIn.map((c) => c.conversation)) });
    const messages = await Message.find({ id: In(conversations.map((c) => c.lastMessage)) });
    const conversationToMessage = indexBy(messages, 'conversation');
    return {
      conversations: conversations.map((c) => mapConversation(c, conversationToMessage[c.id])),
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

    // Notify other users
    const usersToNotify = participants.map((p) => p.user).filter((u) => u !== userId);
    sendNewMessageToUsers(usersToNotify, conversationId, mapMessage(message));
    return {
      conversation: mapConversation(conversation, message),
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

conversationRoutes.get(
  '/:conversationId/details',
  loggedInMiddleware,
  wrapExpressPromise<GetConversationDetailsRequest, GetConversationDetailsResponse>(async (req, res) => {
    const { conversationId } = req.params;
    const { userId } = req.session;
    const participant = await Participant.findOne({ conversation: conversationId, user: userId });
    if (!participant) {
      throw new ServiceError(`User ${userId} is not in conversation ${conversationId}`, 403);
    }
    const conversation = await Conversation.findOne({ id: conversationId });
    assertFound(conversation);
    const lastMessage = await getMessage(conversation.lastMessage);
    return { conversation: mapConversation(conversation, lastMessage) };
  })
);

conversationRoutes.post(
  '/:id/details',
  loggedInMiddleware,
  wrapExpressPromise<UpdateConversationDetailsRequest, UpdateConversationDetailsResponse>(async (req, res) => {
    const { id: conversationId } = req.params;
    const { userId } = req.session;
    const { name, avatarUrl } = req.body;
    const participant = await Participant.findOne({ conversation: conversationId, user: userId });
    if (!participant) {
      throw new ServiceError(`User ${userId} not in conversation ${conversationId}`, 403);
    }
    const conversation = await Conversation.findOne({ id: conversationId });
    const lastMessage = await getMessage(conversation.lastMessage);
    if (name) {
      conversation.name = name;
    }
    if (avatarUrl) {
      conversation.avatarUrl = avatarUrl;
    }
    await conversation.save();

    return { conversation: mapConversation(conversation, lastMessage) };
  })
);

async function getMessage(messageId?: number) {
  if (!messageId) {
    return null;
  }
  return await Message.findOne({ id: messageId });
}

async function getUsers(userIds: Array<string>) {
  const foundUsers = await User.find({ id: In(userIds) });
  const missingUsers = difference(
    userIds,
    foundUsers.map((u) => u.id)
  );
  if (missingUsers.length > 0) {
    throw new ServiceError(`Users not found [${missingUsers.join(',')}]`, 404);
  }
  return foundUsers;
}

async function createParticipant(user: string, conversation: string, tm: EntityManager) {
  const userEntity = tm.create(Participant, { user, conversation });
  try {
    await tm.save(userEntity);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new ServiceError(`User ${user} already exists in conversation ${conversation}`, 400);
    }
    console.log(error);
    throw error;
  }
}

function mapMessage(message?: Message): IMessage {
  if (!message) {
    return null;
  }
  return {
    sendingUser: message.sendingUser,
    content: message.content,
    timestamp: message.createdAt.getTime(),
  };
}

function mapConversation(conversation?: Conversation, lastMessage?: Message): IConversation {
  if (!conversation) {
    return null;
  }
  return {
    id: conversation.id,
    name: conversation.name,
    avatarUrl: conversation.avatarUrl,
    lastMessage: mapMessage(lastMessage),
  };
}

export default conversationRoutes;
