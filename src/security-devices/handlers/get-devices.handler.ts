import { Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { deviceSessionsRepository } from '../repositories/device-sessions.repository';

export async function getDevicesHandler(req: Request, res: Response) {
  try {
    const userId = req.userId as string;

    const sessions = await deviceSessionsRepository.findAllByUserId(userId);

    const devices = sessions.map((session) => ({
      ip: session.ip,
      title: session.title,
      lastActiveDate: session.iat.toISOString(),
      deviceId: session.deviceId,
    }));

    res.status(HttpStatus.Ok_200).json(devices);
  } catch {
    res.sendStatus(HttpStatus.InternalServerError_500);
  }
}