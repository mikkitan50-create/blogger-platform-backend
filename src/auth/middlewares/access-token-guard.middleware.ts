import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { jwtService } from '../adapters/jwt.service';

export const accessTokenGuardMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const auth = req.headers['authorization'];
  if (!auth) {
    res.sendStatus(HttpStatus.Unauthorized_401);
    return;
  }

  const [authType, token] = auth.split(' ');
  if (authType !== 'Bearer') {
    res.sendStatus(HttpStatus.Unauthorized_401);
    return;
  }

  const payload = await jwtService.verifyToken(token);
  if (!payload) {
    res.sendStatus(HttpStatus.Unauthorized_401);
    return;
  }

  req.userId = payload.userId;
  next();
};