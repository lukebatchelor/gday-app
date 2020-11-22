type JoinMessage = { userId: string };
type DisconnectMessage = {};
type NewMessageMessage = { conversation: string; message: IMessage };

type SocketEvents = {
  join: JoinMessage;
  disconnect: DisconnectMessage;
  newMessage: NewMessageMessage;
};
