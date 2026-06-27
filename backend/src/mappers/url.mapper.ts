import { IUrl } from '../models/url.model';
import { IUrlMapper, UrlResponseDto } from './interfaces/IUrlMapper';
import { APP_CONSTANTS } from '../constants/app.constants';

export class UrlMapper implements IUrlMapper {
  toResponse(url: IUrl, baseUrl: string): UrlResponseDto {
    return {
      id: (url._id as any).toString(),
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      shortUrl: `${baseUrl.replace(/\/$/, '')}${APP_CONSTANTS.SHORT_URL_PREFIX}${url.shortCode}`,
      clickCount: url.clickCount,
      createdAt: url.createdAt.toISOString(),
    };
  }

  toResponseList(urls: IUrl[], baseUrl: string): UrlResponseDto[] {
    return urls.map((url) => this.toResponse(url, baseUrl));
  }
}
