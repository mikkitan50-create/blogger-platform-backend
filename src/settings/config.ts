import dotenv from 'dotenv';
dotenv.config();

const env = process.env;

export const ADMIN_USERNAME = env.ADMIN_USERNAME || 'admin';
export const ADMIN_PASSWORD = env.ADMIN_PASSWORD || 'qwerty';

export const JWT_SECRET = env.JWT_SECRET || 'super-secret-key-change-me';
export const JWT_EXPIRES_IN = env.JWT_EXPIRES_IN || '1h';

export const SETTINGS = {
  PORT: env.PORT || 3000,
  MONGO_URL: env.MONGO_URL || 'mongodb://localhost:27017',
  DB_NAME: env.DB_NAME || 'blogger-platform',
};