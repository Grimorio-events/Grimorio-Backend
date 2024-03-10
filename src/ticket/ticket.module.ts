import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './ticket.entity';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { EventModule } from 'src/event/event.module';
import { ClerkAuthGuard } from 'src/clerk/clerk-auth.guard';
import { ClerkModule } from 'src/clerk/clerk.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket]),
    forwardRef(() => EventModule),
    ClerkModule,
  ],
  controllers: [TicketController],
  providers: [TicketService, ClerkAuthGuard],
  exports: [TypeOrmModule.forFeature([Ticket])], // Si es necesario usarlo ne otro Modulo
})
export class TicketModule {}

// forwardRef: NestJS manejar referencias que se resolverán en tiempo de ejecución
