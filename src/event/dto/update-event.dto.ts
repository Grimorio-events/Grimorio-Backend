import { PartialType } from '@nestjs/swagger';
import { CreateEventDto } from './create-event.dto';
import { IsEnum, IsString } from 'class-validator';

enum EventStatus {
  approved = 'approved',
  denied = 'denied',
}

export class UpdateEventDto extends PartialType(CreateEventDto) {
  @IsString()
  @IsEnum(EventStatus)
  status: EventStatus;
}
