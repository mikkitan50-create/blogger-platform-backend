import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { jwtService } from '../adapters/jwt.service';
import { revokedTokenRepository } from '../repositories/revoked-token.repository';

export async function refreshTokenGuardMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    res.sendStatus(HttpStatus.Unauthorized_401);
    return;
  }

  const payload = await jwtService.verifyToken(refreshToken);
  if (!payload) {
    res.sendStatus(HttpStatus.Unauthorized_401);
    return;
  }

  const isRevoked = await revokedTokenRepository.isRevoked(refreshToken);
  if (isRevoked) {
    res.sendStatus(HttpStatus.Unauthorized_401);
    return;
  }

  req.refreshToken = refreshToken;
  req.userId = payload.userId;

  next();
}