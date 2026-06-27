import bcrypt from 'bcryptjs';
import { APP_CONSTANTS } from '../constants/app.constants';

export class HashUtil {
  static async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, APP_CONSTANTS.BCRYPT_SALT_ROUNDS);
  }

  static async compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
