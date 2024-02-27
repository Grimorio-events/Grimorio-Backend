import { Ticket } from 'src/ticket/ticket.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 500 })
  address: string;

  @Column('decimal', { precision: 10, scale: 6 })
  latitude: number;

  @Column('decimal', { precision: 10, scale: 6 })
  longitude: number;

  @Column('int')
  totalCapacity: number;

  @Column()
  eventType: string;

  @Column('decimal', { precision: 10, scale: 2 })
  ticketPrice: number;

  @Column()
  ownerId: string;

  @Column('text')
  title: string;

  @Column('text')
  description: string;

  @Column('simple-array')
  images: string[];

  @Column()
  eventDate: Date;

  @Column({ nullable: true })
  eventEndDate: Date;

  @Column()
  status: string;

  @Column('simple-array', { nullable: true })
  categories: string[];

  @Column({ nullable: true })
  ticketPurchaseDeadline: Date;

  @Column({ nullable: true })
  refundPolicy: string;

  @Column('simple-array', { nullable: true })
  socialLinks: string[];

  @Column({ default: 0 })
  rating: number;

  @Column('int', { default: 0 })
  availableTickets: number;

  @Column({ nullable: true })
  ageRestriction: string;

  @Column({ nullable: true })
  organizerContact: string;

  @Column({ nullable: true })
  accessibilityInfo: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('simple-array', { nullable: true })
  documents: string[];

  @OneToMany(() => Ticket, (ticket) => ticket.event, { cascade: true })
  tickets: Ticket[];
}
