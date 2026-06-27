import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.config';

export interface JwtPayload {
  sub: string;
  email: string;
}

export class TokenUtil {
  static sign(payload: JwtPayload): string {
    return jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn as any });
  }

  static verify(token: string): JwtPayload {
    return jwt.verify(token, jwtConfig.secret) as JwtPayload;
  }
}
