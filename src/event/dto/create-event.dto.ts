import {
  IsString,
  IsInt,
  IsArray,
  IsOptional,
  IsDate,
  Min,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventDto {
  @IsString()
  address: string;

  @IsString()
  name: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsInt()
  @Min(0)
  totalCapacity: number;

  @IsString()
  eventType: string;

  @IsNumber()
  ticketPrice: number;

  @IsString()
  ownerId: string;

  @IsString()
  title: string;

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
