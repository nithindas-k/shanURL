import { Request, Response } from 'express';
import { IAuthController } from './interfaces/IAuthController';
import { IAuthService } from '../services/interfaces/IAuthService';
import { ResponseUtil } from '../utils/response.util';
import { MESSAGES } from '../constants/messages.constants';
import { STATUS_CODES } from '../constants/status-codes.constants';
import { AppError } from '../services/auth.service';

export class AuthController implements IAuthController {
  constructor(private authService: IAuthService) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, confirmPassword } = req.body;
      const user = await this.authService.register(email, password, confirmPassword);
      ResponseUtil.success(res, MESSAGES.AUTH.REGISTER_SUCCESS, user, STATUS_CODES.CREATED);
    } catch (error) {
      if (error instanceof AppError) {
        ResponseUtil.error(res, error.message, error.statusCode);
      } else {
        ResponseUtil.error(res, MESSAGES.SERVER.INTERNAL_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      ResponseUtil.success(res, MESSAGES.AUTH.LOGIN_SUCCESS, result, STATUS_CODES.OK);
    } catch (error) {
      if (error instanceof AppError) {
        ResponseUtil.error(res, error.message, error.statusCode);
      } else {
        ResponseUtil.error(res, MESSAGES.SERVER.INTERNAL_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
