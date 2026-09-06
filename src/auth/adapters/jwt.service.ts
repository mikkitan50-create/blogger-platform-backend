import jwt from 'jsonwebtoken';
import { JWT_SECRET, ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from '../../settings/config';

export type TokenPayload = {
  userId: string;
  deviceId?: string;
  iat: Date;
};

export const jwtService = {
  async createAccessToken(userId: string): Promise<string> {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN } as jwt.SignOptions);
  },

  async createRefreshToken(userId: string, deviceId: string): Promise<string> {
    return jwt.sign({ userId, deviceId }, JWT_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    } as jwt.SignOptions);
  },

  async verifyToken(token: string): Promise<TokenPayload | null> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & {
        userId: string;
        deviceId?: string;
      };

      return {
        userId: decoded.userId,
        deviceId: decoded.deviceId,
        iat: new Date(decoded.iat! * 1000),
      };
    } catch (error) {
      return null;
    }
  },
};