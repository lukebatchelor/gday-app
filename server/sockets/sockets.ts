import cookie from 'cookie';
import http from 'http';
import Redis from 'ioredis';
import pino from 'pino';
import socketIo from 'socket.io';

import { getSafeSocket, SafeSocket } from './safe-socket';
import { createSubscriber } from '../notification/notification-center';
import { Participant } from '../entity/Participant';

const logger = pino();
const redisClient = new Redis(process.env.REDIS_URL);

export function configureSockets(appServer: http.Server) {
  const server = socketIo(appServer, { pingTimeout: 2000, pingInterval: 10000 });

  server.on('connect', async (client: socketIo.Socket) => {
    // Check request is coming from  a logged in user
    const cookies = cookie.parse(client.handshake.headers.cookie);
    const sessionCookie = cookies['gday-session'];
    if (!sessionCookie) {
      return;
    }
    const sessionId = sessionCookie.split('s:')[1].split('.')[0];
    const redisResponse = await redisClient.get(`sess:${sessionId}`);
    if (!redisResponse) {
      return;
    }
    const userId = JSON.parse(redisResponse).userId;

    logger.info(`Client connected  ${client.id} (${userId})`);
    const safeSocket = getSafeSocket(client, server);

    // Subscribe to events in any conversation the client belongs to.
    const subscriber = createSubscriber(newMessage);
    const conversations = (await Participant.find({ user: userId })).map((p) => p.conversation);
    for (const conversation of conversations) {
      subscriber.subscribeToConversation(conversation);
    }

    function newMessage({ conversation, message }: { conversation: string; message: IMessage }) {
      safeSocket.safeEmit('newMessage', { conversation, message });
    }

    // Setup event listeners for client
    safeSocket.safeOn('disconnect', handleDisconnect);
    async function handleDisconnect() {
      logger.info(`${client.id} disconnected`);
      await subscriber.unsubscribe();
    }
  });
}
