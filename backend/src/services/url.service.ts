import { IUrlService } from './interfaces/IUrlService';
import { IUrlRepository } from '../repositories/interfaces/IUrlRepository';
import { UrlResponseDto } from '../mappers/interfaces/IUrlMapper';
import { UrlMapper } from '../mappers/url.mapper';
import { ShortCodeUtil } from '../utils/short-code.util';
import { appConfig } from '../config/app.config';
import { MESSAGES } from '../constants/messages.constants';
import { STATUS_CODES } from '../constants/status-codes.constants';
import { AppError } from './auth.service';

export class UrlService implements IUrlService {
  private urlMapper = new UrlMapper();

  constructor(private urlRepository: IUrlRepository) {}

  async createShortUrl(originalUrl: string, userId: string): Promise<UrlResponseDto> {
    let shortCode: string;
    let exists = true;

    // generate unique short code — retry on collision
    do {
      shortCode = ShortCodeUtil.generate();
      exists = await this.urlRepository.shortCodeExists(shortCode);
    } while (exists);

    const url = await this.urlRepository.create(originalUrl, shortCode, userId);
    return this.urlMapper.toResponse(url, appConfig.baseUrl);
  }

  async getUserUrls(userId: string): Promise<UrlResponseDto[]> {
    const urls = await this.urlRepository.findByUserId(userId);
    return this.urlMapper.toResponseList(urls, appConfig.baseUrl);
  }

  async resolveShortCode(shortCode: string): Promise<string> {
    const url = await this.urlRepository.findByShortCode(shortCode);
    if (!url) {
      throw new AppError(MESSAGES.URL.NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }
    await this.urlRepository.incrementClickCount(shortCode);
    return url.originalUrl;
  }
}
