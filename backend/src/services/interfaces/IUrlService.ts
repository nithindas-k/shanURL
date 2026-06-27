import { UrlResponseDto } from '../../mappers/interfaces/IUrlMapper';

export interface IUrlService {
  createShortUrl(originalUrl: string, userId: string): Promise<UrlResponseDto>;
  getUserUrls(userId: string): Promise<UrlResponseDto[]>;
  resolveShortCode(shortCode: string): Promise<string>;
}
