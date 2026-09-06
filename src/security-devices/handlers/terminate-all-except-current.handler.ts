import { Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { deviceSessionsRepository } from '../repositories/device-sessions.repository';

export async function terminateAllExceptCurrentHandler(req: Request, res: Response) {
  try {
    const userId = req.userId as string;
    const currentDeviceId = req.deviceId as string;

    await deviceSessionsRepository.deleteAllExceptCurrent(userId, currentDeviceId);

    res.sendStatus(HttpStatus.NoContent_204);
  } catch {
    res.sendStatus(HttpStatus.InternalServerError_500);
  }
}