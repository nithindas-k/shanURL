import { IAuthService, AuthResponseDto } from './interfaces/IAuthService';
import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { UserResponseDto } from '../mappers/interfaces/IUserMapper';
import { UserMapper } from '../mappers/user.mapper';
import { HashUtil } from '../utils/hash.util';
import { TokenUtil } from '../utils/token.util';
import { MESSAGES } from '../constants/messages.constants';
import { STATUS_CODES } from '../constants/status-codes.constants';

export class AppError extends Error {
  constructor(public message: string, public statusCode: number) {
    super(message);
  }
}

export class AuthService implements IAuthService {
  private userMapper = new UserMapper();

  constructor(private userRepository: IUserRepository) {}

  async register(
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<UserResponseDto> {
    if (password !== confirmPassword) {
      throw new AppError(MESSAGES.AUTH.PASSWORD_MISMATCH, STATUS_CODES.BAD_REQUEST);
    }

    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new AppError(MESSAGES.AUTH.USER_EXISTS, STATUS_CODES.CONFLICT);
    }

    const hashedPassword = await HashUtil.hash(password);
    const user = await this.userRepository.create(email, hashedPassword);
    return this.userMapper.toResponse(user);
  }

  async login(email: string, password: string): Promise<AuthResponseDto> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError(MESSAGES.AUTH.INVALID_CREDENTIALS, STATUS_CODES.UNAUTHORIZED);
    }

    const isMatch = await HashUtil.compare(password, user.password);
    if (!isMatch) {
      throw new AppError(MESSAGES.AUTH.INVALID_CREDENTIALS, STATUS_CODES.UNAUTHORIZED);
    }

    const accessToken = TokenUtil.sign({
      sub: (user._id as any).toString(),
      email: user.email,
    });

    return {
      user: this.userMapper.toResponse(user),
      accessToken,
    };
  }
}
