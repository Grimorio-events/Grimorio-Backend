import {
  IsString,
  IsDecimal,
  IsInt,
  IsArray,
  IsOptional,
  IsDate,
  Min,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventDto {
  @IsString()
  address: string;

  @IsDecimal()
  latitude: number;

  @IsDecimal()
  longitude: number;

  @IsInt()
  @Min(0)
  totalCapacity: number;

  @IsString()
  eventType: string;

  @IsDecimal()
  ticketPrice: number;

  @IsUUID()
  ownerId: string;

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  documents?: string[];

  @Type(() => Date)
  @IsDate()
  eventDate: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  eventEndDate?: Date;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categories?: string[];

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  ticketPurchaseDeadline?: Date;

  @IsString()
  @IsOptional()
  refundPolicy?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  socialLinks?: string[];

  @IsString()
  @IsOptional()
  ageRestriction?: string;

  @IsString()
  @IsOptional()
  organizerContact?: string;

  @IsString()
  @IsOptional()
  accessibilityInfo?: string;
}
