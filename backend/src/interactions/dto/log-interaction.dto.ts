import { IsEnum, IsString, IsUUID } from 'class-validator';
import { ActionType } from '../interaction.entity';

export class LogInteractionDto {
  @IsString()
  sessionId: string;

  @IsEnum(ActionType)
  action: ActionType;
}
