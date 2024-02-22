import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './ticket.entity';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
  ) {}

  async assignUserToTicket(ticketId: string, userId: string): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOneBy({ id: ticketId });

    if (!ticket) {
      throw new NotFoundException(`Ticket with ID "${ticketId}" not found.`);
    }

    if (ticket.userId) {
      throw new BadRequestException(
        `Ticket with ID "${ticketId}" is already assigned.`,
      );
    }

    ticket.userId = userId;
    await this.ticketRepository.save(ticket);
    return ticket;
  }
}
