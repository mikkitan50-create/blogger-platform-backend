import { Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { deviceSessionsRepository } from '../repositories/device-sessions.repository';

export async function terminateDeviceHandler(
  req: Request<{ deviceId: string }>,
  res: Response,
) {
  try {
    const userId = req.userId as string;
    const { deviceId } = req.params;

    const session = await deviceSessionsRepository.findByDeviceId(deviceId);
    if (!session) {
      res.sendStatus(HttpStatus.NotFound_404);
      return;
    }

    if (session.userId !== userId) {
      res.sendStatus(HttpStatus.Forbidden_403);
      return;
    }

    await deviceSessionsRepository.deleteByDeviceId(deviceId);

    res.sendStatus(HttpStatus.NoContent_204);
  } catch {
    res.sendStatus(HttpStatus.InternalServerError_500);
  }
}