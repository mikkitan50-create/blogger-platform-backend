import { model, Model, Schema } from 'mongoose';
import { RequestLog } from '../types/request-log';

const requestLogSchema = new Schema<RequestLog>({
  ip: { type: String, required: true },
  url: { type: String, required: true },
  date: { type: Date, required: true },
});

type RequestLogModelType = Model<RequestLog>;

export const RequestLogModel = model<RequestLog, RequestLogModelType>(
  'requestsLog',
  requestLogSchema,
  'requestsLog',
);