import { ServiceError } from '../../error/service-error';

function loggedInMiddleware(req: Express.Request, res: Express.Response, next: any) {
  if (!req.session.userId) {
    return next(new ServiceError('Unauthenticated', 401));
  }
  next();
}

export { loggedInMiddleware };
