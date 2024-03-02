import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Event } from './event.entity';
import { Ticket } from 'src/ticket/ticket.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name); // Instancia de Logger

  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    private dataSource: DataSource, // Inyectamos DataSource para usarlo con QueryRunner
  ) {}

  // Crear eventos
  async create(createEventDto: CreateEventDto): Promise<Event> {
    this.logger.log(`Crete event success`);
    // this.logger.log(`Crete event: ${JSON.stringify(createEventDto)}`);

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Utiliza el manager del queryRunner para todas las operaciones de la base de datos
      const event = queryRunner.manager.create(Event, {
        ...createEventDto,
        status: 'pending',
      });
      const savedEvent = await queryRunner.manager.save(event);

      // Crea y guarda los tickets asociados al evento dentro de la misma transacción
      const ticketsToCreate = Array.from(
        { length: savedEvent.totalCapacity },
        () => ({
          event: savedEvent,
          price: savedEvent.ticketPrice,
          purchaseDeadline: savedEvent.ticketPurchaseDeadline,
          // Inicializa cualquier otro campo necesario de Ticket aquí, ejemplo, price: savedEvent.ticketPrice
        }),
      );

      await queryRunner.manager.save(Ticket, ticketsToCreate);

      // Commit de la transacción si todo es exitoso
      await queryRunner.commitTransaction();

      return savedEvent;
    } catch (error) {
      this.logger.error(`Error al crear evento: ${error.message}`, error.stack);
      // Revierte la transacción si hay errores
      await queryRunner.rollbackTransaction();
      throw new Error('Error creating event'); // Asegúrate de propagar el error para manejarlo más arriba o devolver una respuesta adecuada
    } finally {
      // Libera el queryRunner para devolver la conexión al pool
      await queryRunner.release();
    }
  }

  async findAll(limit: number = 10, offset: number = 0): Promise<Event[]> {
    return this.eventRepository.find({
      take: limit,
      skip: offset,
      // Añadir ordenación aquí si es necesario
      order: {
        createdAt: 'DESC', // Ordena los eventos por fecha de creación de manera descendente
      },
    });
  }

  async findOne(id: string): Promise<Event | null> {
    return this.eventRepository.findOneBy({ id });
  }

  async update(
    id: string,
    updateEventDto: UpdateEventDto,
  ): Promise<Event | null> {
    await this.eventRepository.update(id, updateEventDto);
    return this.eventRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.eventRepository.delete(id);
  }
}
