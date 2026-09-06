import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { jwtService } from '../adapters/jwt.service';
import { deviceSessionsRepository } from '../../security-devices/repositories/device-sessions.repository';

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
  if (!payload || !payload.deviceId) {
    res.sendStatus(HttpStatus.Unauthorized_401);
    return;
  }

  const session = await deviceSessionsRepository.findByDeviceId(payload.deviceId);
  if (!session || session.iat.getTime() !== payload.iat.getTime()) {
    res.sendStatus(HttpStatus.Unauthorized_401);
    return;
  }

  req.refreshToken = refreshToken;
  req.userId = payload.userId;
  req.deviceId = payload.deviceId;

  next();
}