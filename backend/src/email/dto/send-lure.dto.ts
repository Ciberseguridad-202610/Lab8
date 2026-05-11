import { IsEmail } from 'class-validator';

export class SendLureDto {
  @IsEmail()
  to: string;
}
