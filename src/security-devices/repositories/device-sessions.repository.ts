import { WithId } from 'mongodb';
import { deviceSessionCollection } from '../../db/collections';
import { DeviceSession } from '../types/device-session';

export const deviceSessionsRepository = {
  async create(newSession: DeviceSession): Promise<WithId<DeviceSession>> {
    const insertResult = await deviceSessionCollection.insertOne(newSession);
    return { ...newSession, _id: insertResult.insertedId };
  },

  async findByDeviceId(deviceId: string): Promise<WithId<DeviceSession> | null> {
    return deviceSessionCollection.findOne({ deviceId });
  },

  async findAllByUserId(userId: string): Promise<WithId<DeviceSession>[]> {
    return deviceSessionCollection.find({ userId }).toArray();
  },

  async updateIatAndExp(deviceId: string, newIat: Date, newExp: Date): Promise<boolean> {
    const updateResult = await deviceSessionCollection.updateOne(
      { deviceId },
      { $set: { iat: newIat, exp: newExp } },
    );
    return updateResult.matchedCount > 0;
  },

  async deleteByDeviceId(deviceId: string): Promise<boolean> {
    const deleteResult = await deviceSessionCollection.deleteOne({ deviceId });
    return deleteResult.deletedCount > 0;
  },

  async deleteAllExceptCurrent(userId: string, currentDeviceId: string): Promise<void> {
    await deviceSessionCollection.deleteMany({
      userId,
      deviceId: { $ne: currentDeviceId },
    });
  },
};