import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class GetRoomsDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  roomIds: string[];
}
