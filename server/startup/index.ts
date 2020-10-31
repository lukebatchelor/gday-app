import pino from 'pino';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { User } from '../entity/User';

const logger = pino();

export default async function runStartupTasks() {
  logger.info('HERE');
  const defaultAdminUserName = process.env.DEFAULT_ADMIN_USER_NAME;
  const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD;
  if (!defaultAdminUserName || !defaultAdminPassword) {
    throw new Error('Config error: DEFAULT_ADMIN_EMAIL or DEFAULT_ADMIN_PASSWORD');
  }
  const user = await User.findOne({ userName: defaultAdminUserName });
  if (!user) {
    logger.info('Creating default admin account');
    const user = await User.create({
      id: `U${crypto.randomBytes(12).toString('hex')}`.substr(0, 12),
      userName: defaultAdminUserName,
      password: bcrypt.hashSync(defaultAdminPassword, bcrypt.genSaltSync(8)),
      displayName: defaultAdminUserName,
      isAdmin: true,
    });
    await user.save();
  }
}
