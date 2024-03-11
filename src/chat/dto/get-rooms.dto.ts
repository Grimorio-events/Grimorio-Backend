import { IsNotEmpty, IsString } from 'class-validator';

export class GetRoomsDto {
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  roomId: string;
}
