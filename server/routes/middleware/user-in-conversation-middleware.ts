import { ServiceError } from '../../error/service-error';
import { Participant } from '../../entity/Participant';

async function userInConversationMiddleware(
  req: Express.Request & { params: { [key: string]: string } },
  res: Express.Response,
  next: any
) {
  const { conversationId } = req.params;
  const { userId } = req.session;
  if (!conversationId || !userId) {
    return next(new ServiceError('Forbidden', 403));
  }
  const participant = await Participant.findOne({ conversation: conversationId, user: userId });
  if (!participant) {
    return next(new ServiceError('Forbidden', 403));
  }
  next();
}

export { userInConversationMiddleware };
