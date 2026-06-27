import { Request, Response, NextFunction } from 'express';
import { IAuthMiddleware } from './interfaces/IAuthMiddleware';
import { TokenUtil } from '../utils/token.util';
import { ResponseUtil } from '../utils/response.util';
import { MESSAGES } from '../constants/messages.constants';
import { STATUS_CODES } from '../constants/status-codes.constants';
import { APP_CONSTANTS } from '../constants/app.constants';

// extend Request to carry user
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string };
    }
  }
}

export class AuthMiddleware implements IAuthMiddleware {
  protect(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers[APP_CONSTANTS.TOKEN_HEADER.toLowerCase()];

    if (!authHeader || !String(authHeader).startsWith(`${APP_CONSTANTS.TOKEN_PREFIX} `)) {
      ResponseUtil.error(res, MESSAGES.AUTH.TOKEN_MISSING, STATUS_CODES.UNAUTHORIZED);
      return;
    }

    const token = String(authHeader).split(' ')[1];

    try {
      const payload = TokenUtil.verify(token);
      req.user = { id: payload.sub, email: payload.email };
      next();
    } catch {
      ResponseUtil.error(res, MESSAGES.AUTH.TOKEN_INVALID, STATUS_CODES.UNAUTHORIZED);
    }
  }
}
