import { Module, forwardRef } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { TicketModule } from 'src/ticket/ticket.module';
import { ClerkModule } from 'src/clerk/clerk.module';
import { ClerkAuthGuard } from 'src/clerk/clerk-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
    forwardRef(() => TicketModule), // Aplicamos forwardRef para evitar dependencias circulares (Event y Ticket en este caso)
    ClerkModule,
  ],
  controllers: [EventController],
  providers: [EventService, ClerkAuthGuard],
  exports: [TypeOrmModule.forFeature([Event])],
})
export class EventModule {}
