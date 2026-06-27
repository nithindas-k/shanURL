import { UrlModel, IUrl } from '../models/url.model';
import { IUrlRepository } from './interfaces/IUrlRepository';

export class UrlRepository implements IUrlRepository {
  async create(originalUrl: string, shortCode: string, userId: string): Promise<IUrl> {
    return UrlModel.create({ originalUrl, shortCode, userId });
  }

  async findByUserId(userId: string): Promise<IUrl[]> {
    return UrlModel.find({ userId }).sort({ createdAt: -1 });
  }

  async findByShortCode(shortCode: string): Promise<IUrl | null> {
    return UrlModel.findOne({ shortCode });
  }

  async shortCodeExists(shortCode: string): Promise<boolean> {
    const doc = await UrlModel.findOne({ shortCode }).select('_id');
    return !!doc;
  }

  async incrementClickCount(shortCode: string): Promise<void> {
    await UrlModel.updateOne({ shortCode }, { $inc: { clickCount: 1 } });
  }
}
