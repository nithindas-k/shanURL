import { IUrl } from '../../models/url.model';

export interface UrlResponseDto {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clickCount: number;
  createdAt: string;
}

export interface IUrlMapper {
  toResponse(url: IUrl, baseUrl: string): UrlResponseDto;
  toResponseList(urls: IUrl[], baseUrl: string): UrlResponseDto[];
}
