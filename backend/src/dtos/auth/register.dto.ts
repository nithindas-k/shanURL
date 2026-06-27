import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { MESSAGES } from '../../constants/messages.constants';

export class RegisterDto {
  @IsEmail({}, { message: MESSAGES.VALIDATION.EMAIL_INVALID })
  @IsNotEmpty({ message: MESSAGES.VALIDATION.EMAIL_REQUIRED })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: MESSAGES.VALIDATION.PASSWORD_REQUIRED })
  @MinLength(8, { message: MESSAGES.VALIDATION.PASSWORD_MIN })
  password!: string;

  @IsString()
  @IsNotEmpty({ message: MESSAGES.VALIDATION.CONFIRM_PASSWORD_REQUIRED })
  confirmPassword!: string;
}
