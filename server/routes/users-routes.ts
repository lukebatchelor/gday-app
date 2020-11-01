import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import express from 'express';
import pino from 'pino';
import { In } from 'typeorm';
import { User } from '../entity/User';
import { ServiceError } from '../error/service-error';
import { assertFound, wrapExpressPromise } from '../util';
import { loggedInMiddleware } from './middleware/logged-in-middleware';

const logger = pino();

// Hosted at /api/users
const usersRoutes = express.Router();

usersRoutes.get(
  '/',
  loggedInMiddleware,
  wrapExpressPromise<GetUsersRequest, GetUsersResponse>(async (req, res) => {
    let users;
    if (!req.query.users) {
      users = await User.find();
    } else {
      users = await User.find({ id: In(req.query.users.split(',')) });
    }
    return { users: users.map(mapUser) };
  })
);

usersRoutes.post(
  '/signup',
  wrapExpressPromise<PostSignupRequest, PostSignupResponse>(async (req, res) => {
    const { userName, password } = req.body;
    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      throw new ServiceError('userName taken', 400);
    }
    const user = await User.create({
      id: `U${crypto.randomBytes(12).toString('hex')}`.substr(0, 12),
      userName,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(8)),
      displayName: userName,
      isAdmin: true,
    });
    await user.save();
    return {
      loggedIn: true,
      user: mapUser(user),
    };
  })
);

usersRoutes.post(
  '/authenticate',
  wrapExpressPromise<PostLoginRequest, PostLoginResponse>(async (req, res) => {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });
    assertFound(user);
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return { loggedIn: false };
    }
    req.session.userId = user.id;
    return { loggedIn: true, user: mapUser(user) };
  })
);

usersRoutes.get(
  '/authenticated',
  wrapExpressPromise<GetAuthenticatedRequest, GetAuthenticatedResponse>(async (req, res) => {
    if (!req.session.userId) {
      return { loggedIn: false };
    }
    const user = await User.findOne({ id: req.session.userId });
    if (!user) {
      return { loggedIn: false };
    }

    return { loggedIn: true, user: mapUser(user) };
  })
);

usersRoutes.post(
  '/:userId/details',
  loggedInMiddleware,
  wrapExpressPromise<UpdateUserDetailsRequest, UpdateUserDetailsResponse>(async (req, res) => {
    const { userId } = req.params;
    const { displayName, avatarUrl } = req.body;
    const user = await User.findOne({ id: userId });
    assertFound(user);
    if (displayName) {
      user.displayName = displayName;
    }
    if (avatarUrl) {
      user.avatarUrl = avatarUrl;
    }
    await user.save();
    return { user: mapUser(user) };
  })
);

function mapUser(user: User): IUser {
  return {
    id: user.id,
    userName: user.userName,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    status: user.status,
    isAdmin: user.isAdmin,
  };
}

export default usersRoutes;
