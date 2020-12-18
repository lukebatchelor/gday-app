import Redis from 'ioredis';

type NewMessageCallback = ({ conversation, message }: { conversation: string; message: IMessage }) => void;

class Subscriber {
  redisClient: Redis.Redis;
  constructor(callback: NewMessageCallback) {
    this.redisClient = new Redis(process.env.REDIS_URL);
    this.redisClient.on('message', (room, message) =>
      callback({ conversation: room.split('conversation:')[1], message: JSON.parse(message) })
    );
  }

  async subscribeToConversation(conversationId: string) {
    await this.redisClient.subscribe(`conversation:${conversationId}`);
  }

  async unsubscribe() {
    await this.redisClient.unsubscribe();
  }
}

class Publisher {
  redisClient: Redis.Redis;
  constructor() {
    this.redisClient = new Redis(process.env.REDIS_URL);
  }

  async publishMessageToConversation(conversationId: string, message: IMessage) {
    await this.redisClient.publish(`conversation:${conversationId}`, JSON.stringify(message));
  }
}

export function createSubscriber(callback: NewMessageCallback) {
  return new Subscriber(callback);
}

export function createPublisher() {
  return new Publisher();
}
