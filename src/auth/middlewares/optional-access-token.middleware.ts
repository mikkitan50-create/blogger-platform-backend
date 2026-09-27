import { Request, Response, NextFunction } from 'express';
import { jwtService } from '../adapters/jwt.service';

export const optionalAccessTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const auth = req.headers['authorization'];
  if (!auth) {
    next();
    return;
  }

  const [authType, token] = auth.split(' ');
  if (authType !== 'Bearer' || !token) {
    next();
    return;
  }

  const payload = await jwtService.verifyToken(token);
  if (payload) {
    req.userId = payload.userId;
  }

  next();
};