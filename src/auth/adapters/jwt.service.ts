import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { JWT_SECRET, ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from '../../settings/config';

export const jwtService = {
  async createAccessToken(userId: string): Promise<string> {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN } as jwt.SignOptions);
  },

  async createRefreshToken(userId: string): Promise<string> {
    return jwt.sign({ userId, jti: randomUUID() }, JWT_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    } as jwt.SignOptions);
  },

  async verifyToken(token: string): Promise<{ userId: string; jti?: string } | null> {
    try {
      return jwt.verify(token, JWT_SECRET) as { userId: string; jti?: string };
    } catch (error) {
      return null;
    }
  },
};