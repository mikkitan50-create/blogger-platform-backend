import { HydratedDocument, model, Model, Schema } from 'mongoose';
import { DeviceSession } from '../types/device-session';

const deviceSessionSchema = new Schema<DeviceSession>({
  userId: { type: String, required: true },
  deviceId: { type: String, required: true },
  ip: { type: String, required: true },
  title: { type: String, required: true },
  iat: { type: Date, required: true },
  exp: { type: Date, required: true },
});

export type DeviceSessionDocument = HydratedDocument<DeviceSession>;
type DeviceSessionModelType = Model<DeviceSession>;

export const DeviceSessionModel = model<DeviceSession, DeviceSessionModelType>(
  'deviceSessions',
  deviceSessionSchema,
  'deviceSessions',
);