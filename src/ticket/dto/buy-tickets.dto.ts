import { IsInt, Min, IsUUID, IsString } from 'class-validator';

export class BuyTicketsDto {
  @IsUUID()
  eventId: string;

  @IsString()
  userId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
