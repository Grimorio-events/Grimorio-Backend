import { TicketService } from './ticket.service';
import { AssignTicketDto } from './dto/assign-ticket.dto';
import { ClerkAuthGuard } from 'src/clerk/clerk-auth.guard';
import {
  Controller,
  Patch,
  Param,
  Body,
  ParseUUIDPipe,
  UseGuards,
  Post,
  BadRequestException,
  Get,
} from '@nestjs/common';
import { BuyTicketsDto } from './dto/buy-tickets.dto';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @UseGuards(ClerkAuthGuard)
  @Patch(':ticketId/assign-user')
  async assignUserToTicket(
    @Param('ticketId', ParseUUIDPipe) ticketId: string,
    @Body() assignTicketDto: AssignTicketDto,
  ) {
    return this.ticketService.assignUserToTicket(
      ticketId,
      assignTicketDto.userId,
    );
  }

  // Compra de Tickets
  @UseGuards(ClerkAuthGuard) // Autenticación con Clerk
  @Post('/buy')
  async buyTickets(@Body() buyTicketsDto: BuyTicketsDto) {
    // paso 1: Verificación de Disponibilidad de Tickets
    const isAvailable = await this.ticketService.checkTicketAvailability(
      buyTicketsDto.eventId,
      buyTicketsDto.userId,
      buyTicketsDto.quantity,
    );

    if (!isAvailable) {
      throw new BadRequestException('There are no tickets available');
    }

    // Si hay disponibilidad, proceder con los pasos siguientes...

    // Paso 2: Asignación de Tickets a un Usuario
    await this.ticketService.purchaseTickets(
      buyTicketsDto.eventId,
      buyTicketsDto.userId,
      buyTicketsDto.quantity,
    );

    // Aquí podrías proceder con la lógica de pago y finalización de la compra
    // Paso 3: Compra por Stripe (pendiente)
    return { message: 'Tickets successfully purchased' };

    // Paso 4: Actualización de Tickets Disponibles en el Evento
    // Se realiza en el ticket.service.ts llamando a event.service.ts (updateAvailableTickets)
  }

  @UseGuards(ClerkAuthGuard)
  @Get('/user/:userId')
  async getTicketByUser(@Param('userId') userId: string) {
    return this.ticketService.getTicketsByUser(userId);
  }
}
