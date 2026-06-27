import { IUser } from '../../models/user.model';

export interface UserResponseDto {
  id: string;
  email: string;
  createdAt: string;
}

export interface IUserMapper {
  toResponse(user: IUser): UserResponseDto;
}
