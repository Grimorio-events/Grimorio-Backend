import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  readonly senderId: string; // ID del usuario que envía el mensaje (opcionalmente podría no ser necesario si usas el ID de la sesión autenticada)

  @IsString()
  @IsNotEmpty()
  readonly receiverId: string; // ID del usuario destinatario

  @IsString()
  @IsNotEmpty()
  readonly text: string; // Contenido del mensaje

  @IsString()
  @IsOptional()
  readonly roomId?: string; // ID de la sala, si estás enviando a una sala/chat grupal
}
