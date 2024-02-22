import { IsUUID } from 'class-validator';

export class AssignTicketDto {
  @IsUUID()
  userId: string;
}
