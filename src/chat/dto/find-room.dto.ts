import { IsNotEmpty, IsString } from 'class-validator';

export class FindRoomDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  ownerId: string;
}
