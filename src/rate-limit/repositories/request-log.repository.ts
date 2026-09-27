import { injectable } from 'inversify';
import { RequestLogModel } from '../domain/request-log.entity';

@injectable()
export class RequestLogRepository {
  async logRequest(ip: string, url: string): Promise<void> {
    await RequestLogModel.create({ ip, url, date: new Date() });
  }

  async countRequests(ip: string, url: string, sinceDate: Date): Promise<number> {
    return RequestLogModel.countDocuments({
      ip,
      url,
      date: { $gte: sinceDate },
    });
  }
}

export const requestLogRepository = new RequestLogRepository();