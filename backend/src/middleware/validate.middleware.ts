import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ResponseUtil } from '../utils/response.util';
import { STATUS_CODES } from '../constants/status-codes.constants';

export function validateDto<T extends object>(DtoClass: new () => T) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const dto = plainToInstance(DtoClass, req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      const message = Object.values(errors[0].constraints || {})[0];
      ResponseUtil.error(res, message, STATUS_CODES.BAD_REQUEST);
      return;
    }

    req.body = dto;
    next();
  };
}
