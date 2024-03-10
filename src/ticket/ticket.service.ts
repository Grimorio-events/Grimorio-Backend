import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, IsNull, Repository } from 'typeorm';
import { Ticket } from './ticket.entity';
import { EventService } from 'src/event/event.service';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    private dataSource: DataSource,
    private eventService: EventService,
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

  // Compra de Ticket's
  // paso 1: Verificación de Disponibilidad de Tickets
  async checkTicketAvailability(
    eventId: string,
    userId: string,
    quantity: number,
  ): Promise<boolean> {
    const availableTicketsCount = await this.ticketRepository.count({
      where: { event: { id: eventId }, userId: IsNull() },
    });

    return availableTicketsCount >= quantity;
  }

  // paso 2: Asignación de Tickets a un Usuario
  async purchaseTickets(
    eventId: string,
    userId: string,
    quantity: number,
  ): Promise<void> {
    // Iniciar una transacción para asegurar la consistencia de la base de datos
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Obtener tickets disponibles para el evento
      const availableTickets = await queryRunner.manager.find(Ticket, {
        where: { event: { id: eventId }, userId: IsNull(), available: true },
        take: quantity,
      });

      // Verificar si hay suficientes tickets disponibles
      if (availableTickets.length < quantity) {
        throw new BadRequestException('Not enough tickets available');
      }

      // Asignar los tickets al usuario y marcarlos como no disponibles
      for (const ticket of availableTickets) {
        ticket.userId = userId;
        ticket.available = false;
        await queryRunner.manager.save(ticket);
      }

      // Actualizamos los tickets disponibles
      await this.eventService.updateAvailableTickets(eventId, quantity);

      // 4. Confirmar la transacción
      await queryRunner.commitTransaction();
    } catch (error) {
      // En caso de error, revertir los cambios
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Liberar el query runner
      await queryRunner.release();
    }
  }
  // paso 3: Actualización de Tickets Disponibles en el Evento

  // Consulta los tickets que tiene asignado el usuario
  async getTicketsByUser(userId: string): Promise<any[]> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Obtener todos los tickets asignados al usuario, sin iniciar una transacción
      const ticketsByUserId = await this.ticketRepository.find({
        where: { userId: userId },
        relations: ['event'], // Incluye los detalles del evento directamente
      });

      if (ticketsByUserId.length <= 0) {
        throw new BadRequestException('Unassigned entries');
      }

      // 2. Agrupar tickets por eventId
      const groupedTickets = ticketsByUserId.reduce((acc, ticket) => {
        // Agrupa usando eventId como clave
        const eventId = ticket.event.id;

        if (!acc[eventId]) {
          acc[eventId] = {
            event: ticket.event,
            tickets: [],
          };
        }
        acc[eventId].tickets.push(ticket);

        return acc;
      }, {});

      // 3. Convertir el objeto agrupado en un array
      const result = Object.values(groupedTickets);

      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    }
  }
}
