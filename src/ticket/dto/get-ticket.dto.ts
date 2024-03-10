import { IsString } from 'class-validator';

export class vetTicketsByUserDto {
  @IsString()
  userId: string;
}
