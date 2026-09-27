import { injectable } from 'inversify';
import { DeviceSessionDocument, DeviceSessionModel } from '../domain/device-session.entity';

@injectable()
export class DeviceSessionsRepository {
  async findByDeviceId(deviceId: string): Promise<DeviceSessionDocument | null> {
    return DeviceSessionModel.findOne({ deviceId });
  }

  async findAllByUserId(userId: string): Promise<DeviceSessionDocument[]> {
    return DeviceSessionModel.find({ userId });
  }

  async save(session: DeviceSessionDocument): Promise<void> {
    await session.save();
  }

  async deleteByDeviceId(deviceId: string): Promise<boolean> {
    const deleteResult = await DeviceSessionModel.deleteOne({ deviceId });
    return deleteResult.deletedCount > 0;
  }

  async deleteAllExceptCurrent(userId: string, currentDeviceId: string): Promise<void> {
    await DeviceSessionModel.deleteMany({
      userId,
      deviceId: { $ne: currentDeviceId },
    });
  }
}

export const deviceSessionsRepository = new DeviceSessionsRepository();