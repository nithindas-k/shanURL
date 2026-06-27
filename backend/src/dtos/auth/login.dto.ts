import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { MESSAGES } from '../../constants/messages.constants';

export class LoginDto {
  @IsEmail({}, { message: MESSAGES.VALIDATION.EMAIL_INVALID })
  @IsNotEmpty({ message: MESSAGES.VALIDATION.EMAIL_REQUIRED })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: MESSAGES.VALIDATION.PASSWORD_REQUIRED })
  password!: string;
}
