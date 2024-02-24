import { Module, forwardRef } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { TicketModule } from 'src/ticket/ticket.module';

@Module({
  imports: [TypeOrmModule.forFeature([Event]), forwardRef(() => TicketModule)],
  controllers: [EventController],
  providers: [EventService],
  exports: [TypeOrmModule.forFeature([Event])],
})
export class EventModule {}
