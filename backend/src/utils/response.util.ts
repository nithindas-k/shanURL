import { Response } from 'express';

export interface ApiResponse<T = null> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
}

export class ResponseUtil {
  static success<T>(
    res: Response,
    message: string,
    data: T | null = null,
    statusCode = 200
  ): Response {
    const body: ApiResponse<T> = { success: true, statusCode, message, data };
    return res.status(statusCode).json(body);
  }

  static error(
    res: Response,
    message: string,
    statusCode = 500
  ): Response {
    const body: ApiResponse<null> = { success: false, statusCode, message, data: null };
    return res.status(statusCode).json(body);
  }
}
