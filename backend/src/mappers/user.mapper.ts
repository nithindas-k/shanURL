import { IUser } from '../models/user.model';
import { IUserMapper, UserResponseDto } from './interfaces/IUserMapper';

export class UserMapper implements IUserMapper {
  toResponse(user: IUser): UserResponseDto {
    return {
      id: (user._id as any).toString(),
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
