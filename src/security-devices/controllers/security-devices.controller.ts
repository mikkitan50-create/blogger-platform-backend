import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { TYPES } from '../../composition/types';
import { SecurityDevicesService } from '../application/security-devices.service';

@injectable()
export class SecurityDevicesController {
  constructor(
    @inject(TYPES.SecurityDevicesService) private securityDevicesService: SecurityDevicesService,
  ) {}

  getDevices = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.userId as string;
      const devices = await this.securityDevicesService.getDevicesForUser(userId);
      res.status(HttpStatus.Ok_200).json(devices);
    } catch {
      res.sendStatus(HttpStatus.InternalServerError_500);
    }
  };

  terminateAllExceptCurrent = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.userId as string;
      const currentDeviceId = req.deviceId as string;

      await this.securityDevicesService.terminateAllExceptCurrent(userId, currentDeviceId);

      res.sendStatus(HttpStatus.NoContent_204);
    } catch {
      res.sendStatus(HttpStatus.InternalServerError_500);
    }
  };

  terminateDevice = async (req: Request<{ deviceId: string }>, res: Response): Promise<void> => {
    try {
      const userId = req.userId as string;
      const { deviceId } = req.params;

      const result = await this.securityDevicesService.terminateDevice(userId, deviceId);

      if (result === 'not-found') {
        res.sendStatus(HttpStatus.NotFound_404);
        return;
      }
      if (result === 'forbidden') {
        res.sendStatus(HttpStatus.Forbidden_403);
        return;
      }

      res.sendStatus(HttpStatus.NoContent_204);
    } catch {
      res.sendStatus(HttpStatus.InternalServerError_500);
    }
  };
}