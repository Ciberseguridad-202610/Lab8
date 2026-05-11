import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { ActionType } from '../interaction.entity';

export class LogInteractionDto {
  @IsString()
  sessionId: string;

  @IsEnum(ActionType)
  action: ActionType;

  // Solo se recibe en FORM_SUBMIT para enviar el correo de seguimiento.
  // No es una credencial secreta — es el identificador necesario para la comunicación formativa.
  @IsOptional()
  @IsEmail()
  email?: string;
}
