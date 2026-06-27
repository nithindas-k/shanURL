import { UserResponseDto } from '../../mappers/interfaces/IUserMapper';

export interface AuthResponseDto {
  user: UserResponseDto;
  accessToken: string;
}

export interface IAuthService {
  register(email: string, password: string, confirmPassword: string): Promise<UserResponseDto>;
  login(email: string, password: string): Promise<AuthResponseDto>;
}
