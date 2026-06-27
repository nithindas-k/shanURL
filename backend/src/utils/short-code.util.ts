import crypto from 'crypto';
import { APP_CONSTANTS } from '../constants/app.constants';

export class ShortCodeUtil {
  static generate(): string {
    return crypto
      .randomBytes(APP_CONSTANTS.SHORT_CODE_LENGTH)
      .toString('base64url')
      .slice(0, APP_CONSTANTS.SHORT_CODE_LENGTH);
  }
}
