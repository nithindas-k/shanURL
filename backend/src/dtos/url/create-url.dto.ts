import { IsNotEmpty, IsUrl } from 'class-validator';
import { MESSAGES } from '../../constants/messages.constants';

export class CreateUrlDto {
  @IsUrl({}, { message: MESSAGES.VALIDATION.URL_INVALID })
  @IsNotEmpty({ message: MESSAGES.VALIDATION.URL_REQUIRED })
  originalUrl!: string;
}
