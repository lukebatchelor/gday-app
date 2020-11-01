// For shared global interface types.

declare global {
  interface IUser {
    id: string;
    userName: string;
    displayName: string;
    avatarUrl?: string;
    status?: string;
    isAdmin: boolean;
  }

  interface IConversation {
    id: string;
    name: string;
    avatarUrl?: string;
    lastMessage?: IMessage;
  }

  interface IMessage {
    sendingUser: string;
    content: string;
    timestamp: number;
  }
}

export type ExpressRequestUser = IUser;
