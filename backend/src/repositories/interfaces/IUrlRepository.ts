import { IUrl } from '../../models/url.model';

export interface IUrlRepository {
  create(originalUrl: string, shortCode: string, userId: string): Promise<IUrl>;
  findByUserId(userId: string): Promise<IUrl[]>;
  findByShortCode(shortCode: string): Promise<IUrl | null>;
  shortCodeExists(shortCode: string): Promise<boolean>;
  incrementClickCount(shortCode: string): Promise<void>;
}
