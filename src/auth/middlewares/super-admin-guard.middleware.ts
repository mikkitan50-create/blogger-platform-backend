import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { ADMIN_USERNAME, ADMIN_PASSWORD } from '../../settings/config';

export const superAdminGuardMiddleware = (
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
  if (authType !== 'Basic') {
    res.sendStatus(HttpStatus.Unauthorized_401);
    return;
  }

  const credentials = Buffer.from(token, 'base64').toString('utf-8');
  const [username, password] = credentials.split(':');

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    res.sendStatus(HttpStatus.Unauthorized_401);
    return;
  }

  next();
};