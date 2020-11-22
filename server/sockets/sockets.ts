import socketIo from 'socket.io';
import http from 'http';
import pino from 'pino';
import { getSafeSocket, SafeSocket } from './safe-socket';
import cookie from 'cookie';

import { redisClient } from '../redis/redis';
import { User } from '../entity/User';

const logger = pino();

type ClientMap = { [userId: string]: Array<{ clientId: string; client: SafeSocket }> };
const clients: ClientMap = {};

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

    addClient(userId, safeSocket);

    // Setup event listeners for client
    safeSocket.safeOn('disconnect', handleDisconnect);

    function handleDisconnect() {
      logger.info(`${client.id} disconnected`);
      removeClient(userId, safeSocket);
    }
  });
}

export function sendNewMessageToUsers(users: Array<string>, conversation: string, message: IMessage) {
  for (const user of users) {
    logger.info('sending notification to ' + user);
    const clientsForUser = clients[user];
    if (!clientsForUser) {
      return;
    }
    console.log(clientsForUser);
    for (const client of clientsForUser) {
      client.client.safeEmit('newMessage', { conversation, message });
    }
  }
}

setInterval(() => logClients(), 5000);

function logClients() {
  logger.info(
    Object.keys(clients)
      .map((user) => user + ':' + clients[user].length)
      .join(',')
  );
}

function addClient(userId: string, client: SafeSocket) {
  if (clients[userId]) {
    clients[userId].push({ clientId: client.id, client });
  } else {
    clients[userId] = [{ clientId: client.id, client }];
  }
}

function removeClient(userId: string, client: SafeSocket) {
  clients[userId] = clients[userId].filter((c) => c.clientId !== client.id);
}
