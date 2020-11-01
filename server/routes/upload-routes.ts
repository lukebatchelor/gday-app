import express from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import pino from 'pino';
import { v4 as uuidv4 } from 'uuid';
import { wrapExpressPromise } from '../util';
import { loggedInMiddleware } from './middleware/logged-in-middleware';

const logger = pino();

const conversationStorage = multer.diskStorage({
  destination: (req: Express.Request & { params: { [key: string]: string } }, file, cb) => {
    const { conversationId } = req.params;
    const path = `uploads/conversations/${conversationId}`;
    fs.mkdirSync(path, { recursive: true });
    cb(null, path);
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/avatar/'),
  filename: (req, file, cb) => cb(null, uuidv4() + path.extname(file.originalname)),
});

// Hosted at /api/upload
const uploadRoutes = express.Router();

uploadRoutes.post(
  '/conversations/:conversationId',
  loggedInMiddleware,
  multer({ storage: conversationStorage }).single('file'),
  wrapExpressPromise<UploadFileToConversationRequest, UploadFileToConversationResponse>(async (req, res) => {
    const { conversationId } = req.params;
    return { location: `/media/conversations/${conversationId}/${req.file.filename}` };
  })
);

uploadRoutes.post(
  '/users/:userId/avatar',
  loggedInMiddleware,
  multer({ storage: avatarStorage }).single('avatar'),
  wrapExpressPromise<UploadAvatarRequest, UploadAvatarResponse>(async (req, res) => {
    return { location: `/media/avatar/${req.file.filename}` };
  })
);

export default uploadRoutes;
