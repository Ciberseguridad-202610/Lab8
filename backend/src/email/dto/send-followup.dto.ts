import { IsEmail, IsString } from 'class-validator';

export class SendFollowupDto {
  @IsEmail()
  to: string;

  @IsString()
  sessionId: string;
}
