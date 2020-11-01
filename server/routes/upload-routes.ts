import express from 'express';
import fs from 'fs';
import pino from 'pino';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

import { wrapExpressPromise } from '../util';
import { loggedInMiddleware } from './middleware/logged-in-middleware';

const logger = pino();

const storage = multer.diskStorage({
  destination: (req: Express.Request & { params: { [key: string]: string } }, file, cb) => {
    const { conversationId } = req.params;
    const path = `uploads/conversation/${conversationId}`;
    fs.mkdirSync(path, { recursive: true });
    cb(null, path);
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

// Hosted at /api/upload
const uploadRoutes = express.Router();

uploadRoutes.post(
  '/:conversationId',
  loggedInMiddleware,
  multer({ storage }).single('file'),
  wrapExpressPromise<UploadFileToConversationRequest, UploadFileToConversationResponse>(async (req, res) => {
    const { conversationId } = req.params;
    return { location: `/media/conversation/${conversationId}/${req.file.filename}` };
  })
);

function fileFilter(
  req: Express.Request & { params: { [key: string]: string } },
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  if (!req.params.conversationId) {
    return false;
  }

  return true;
}

export default uploadRoutes;
