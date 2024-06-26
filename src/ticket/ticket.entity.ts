import { Event } from 'src/event/event.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  // JoinColumn,
} from 'typeorm';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Event, (event) => event.tickets)
  // @JoinColumn({ name: 'eventId' })
  event: Event;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  purchaseDeadline: Date;

  @Column({ default: true })
  available: boolean;

  @Column({ nullable: true })
  userId: string;
}
