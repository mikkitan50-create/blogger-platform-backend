import { inject, injectable } from 'inversify';
import { TYPES } from '../../composition/types';
import { DeviceSessionsRepository } from '../repositories/device-sessions.repository';

export type DeviceViewModel = {
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;
};

@injectable()
export class SecurityDevicesService {
  constructor(
    @inject(TYPES.DeviceSessionsRepository) private deviceSessionsRepository: DeviceSessionsRepository,
  ) {}

  async getDevicesForUser(userId: string): Promise<DeviceViewModel[]> {
    const sessions = await this.deviceSessionsRepository.findAllByUserId(userId);

    return sessions.map((session) => ({
      ip: session.ip,
      title: session.title,
      lastActiveDate: session.iat.toISOString(),
      deviceId: session.deviceId,
    }));
  }

  async terminateAllExceptCurrent(userId: string, currentDeviceId: string): Promise<void> {
    await this.deviceSessionsRepository.deleteAllExceptCurrent(userId, currentDeviceId);
  }

  async terminateDevice(
    userId: string,
    deviceId: string,
  ): Promise<'success' | 'not-found' | 'forbidden'> {
    const session = await this.deviceSessionsRepository.findByDeviceId(deviceId);
    if (!session) return 'not-found';

    if (session.userId !== userId) return 'forbidden';

    await this.deviceSessionsRepository.deleteByDeviceId(deviceId);
    return 'success';
  }
}