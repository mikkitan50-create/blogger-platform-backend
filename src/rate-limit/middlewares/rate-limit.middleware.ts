import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { requestLogRepository } from '../repositories/request-log.repository';

const RATE_LIMIT_WINDOW_MS = 10 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

export async function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || 'unknown';
  const url = req.originalUrl;

  await requestLogRepository.logRequest(ip, url);

  const sinceDate = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);
  const requestsCount = await requestLogRepository.countRequests(ip, url, sinceDate);

  if (requestsCount > RATE_LIMIT_MAX_REQUESTS) {
    res.sendStatus(HttpStatus.TooManyRequests_429);
    return;
  }

  next();
}