import express from 'express';
import pino from 'pino';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

import { wrapExpressPromise, assertFound } from '../util';
import { User } from '../entity/User';
import { ServiceError } from '../error/service-error';

const logger = pino();

// Hosted at /api/users
const usersRoutes = express.Router();

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
