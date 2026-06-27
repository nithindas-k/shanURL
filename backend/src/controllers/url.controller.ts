import { Request, Response } from 'express';
import { IUrlController } from './interfaces/IUrlController';
import { IUrlService } from '../services/interfaces/IUrlService';
import { ResponseUtil } from '../utils/response.util';
import { MESSAGES } from '../constants/messages.constants';
import { STATUS_CODES } from '../constants/status-codes.constants';
import { AppError } from '../services/auth.service';

export class UrlController implements IUrlController {
  constructor(private urlService: IUrlService) {}

  async createShortUrl(req: Request, res: Response): Promise<void> {
    try {
      const { originalUrl } = req.body;
      const userId = req.user!.id;
      const result = await this.urlService.createShortUrl(originalUrl, userId);
      ResponseUtil.success(res, MESSAGES.URL.CREATE_SUCCESS, result, STATUS_CODES.CREATED);
    } catch (error) {
      if (error instanceof AppError) {
        ResponseUtil.error(res, error.message, error.statusCode);
      } else {
        ResponseUtil.error(res, MESSAGES.SERVER.INTERNAL_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async getUserUrls(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const urls = await this.urlService.getUserUrls(userId);
      ResponseUtil.success(res, MESSAGES.URL.FETCH_SUCCESS, urls, STATUS_CODES.OK);
    } catch (error) {
      ResponseUtil.error(res, MESSAGES.SERVER.INTERNAL_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
  }

  async redirect(req: Request, res: Response): Promise<void> {
    try {
      const { shortCode } = req.params;
      const originalUrl = await this.urlService.resolveShortCode(shortCode);
      res.redirect(STATUS_CODES.FOUND, originalUrl);
    } catch (error) {
      if (error instanceof AppError) {
        ResponseUtil.error(res, error.message, error.statusCode);
      } else {
        ResponseUtil.error(res, MESSAGES.SERVER.INTERNAL_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
