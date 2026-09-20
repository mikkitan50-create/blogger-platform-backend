import { injectable } from 'inversify';
import { requestLogCollection } from '../../db/collections';

@injectable()
export class RequestLogRepository {
  async logRequest(ip: string, url: string): Promise<void> {
    await requestLogCollection.insertOne({ ip, url, date: new Date() });
  }

  async countRequests(ip: string, url: string, sinceDate: Date): Promise<number> {
    return requestLogCollection.countDocuments({
      ip,
      url,
      date: { $gte: sinceDate },
    });
  }
}

export const requestLogRepository = new RequestLogRepository();