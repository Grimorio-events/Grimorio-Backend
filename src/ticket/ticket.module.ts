import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './ticket.entity';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { EventModule } from 'src/event/event.module';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket]), forwardRef(() => EventModule)],
  controllers: [TicketController],
  providers: [TicketService],
  exports: [TypeOrmModule.forFeature([Ticket])], // Si es necesario usarlo ne otro Modulo
})
export class TicketModule {}

// forwardRef: NestJS manejar referencias que se resolverán en tiempo de ejecución
