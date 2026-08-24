import dotenv from 'dotenv';
dotenv.config();

const env = process.env;

export const ADMIN_USERNAME = env.ADMIN_USERNAME || 'admin';
export const ADMIN_PASSWORD = env.ADMIN_PASSWORD || 'qwerty';

export const JWT_SECRET = env.JWT_SECRET || 'super-secret-key-change-me';
export const ACCESS_TOKEN_EXPIRES_IN = env.ACCESS_TOKEN_EXPIRES_IN || '10s';
export const REFRESH_TOKEN_EXPIRES_IN = env.REFRESH_TOKEN_EXPIRES_IN || '20s';
export const JWT_EXPIRES_IN = env.JWT_EXPIRES_IN || '1h';


export const EMAIL_USER = env.EMAIL_USER || '';
export const EMAIL_PASS = env.EMAIL_PASS || '';
export const EMAIL_FROM = env.EMAIL_FROM || 'Blogger Platform <noreply@example.com>';
export const CONFIRM_EMAIL_URL = env.CONFIRM_EMAIL_URL || 'https://somesite.com/confirm-email';

export const SETTINGS = {
  PORT: env.PORT || 3000,
  MONGO_URL: env.MONGO_URL || 'mongodb://localhost:27017',
  DB_NAME: env.DB_NAME || 'blogger-platform',
};