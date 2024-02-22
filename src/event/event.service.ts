import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Event } from './event.entity';
import { Ticket } from 'src/ticket/ticket.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    private dataSource: DataSource, // Inyectamos DataSource para usarlo con QueryRunner
  ) {}

  // Crear eventos
  async create(createEventDto: CreateEventDto): Promise<Event> {
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
      // Revierte la transacción si hay errores
      await queryRunner.rollbackTransaction();
      throw error; // Asegúrate de propagar el error para manejarlo más arriba o devolver una respuesta adecuada
    } finally {
      // Libera el queryRunner para devolver la conexión al pool
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Event[]> {
    return this.eventRepository.find();
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
