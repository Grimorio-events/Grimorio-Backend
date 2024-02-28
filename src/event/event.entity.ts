import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { Ticket } from 'src/ticket/ticket.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@ObjectType() // Decorador para definir un tipo GraphQL
@Entity()
export class Event {
  @Field(() => ID) // Indicamos que este campo es un ID en GraphQL
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field() // Usa este decorador para exponer campos en GraphQL
  @Column({ length: 500 })
  address: string;

  @Field(() => Float) // Especifica el tipo de campo GraphQL
  @Column('decimal', { precision: 10, scale: 6 })
  latitude: number;

  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 6 })
  longitude: number;

  @Field(() => Int)
  @Column('int')
  totalCapacity: number;

  @Field()
  @Column()
  eventType: string;

  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 2 })
  ticketPrice: number;

  @Field()
  @Column()
  ownerId: string;

  @Field()
  @Column('text')
  title: string;

  @Field()
  @Column('text')
  description: string;

  @Field(() => [String])
  @Column('simple-array')
  images: string[];

  @Field(() => Date)
  @Column()
  eventDate: Date;

  @Field(() => Date, { nullable: true })
  @Column({ nullable: true })
  eventEndDate: Date;

  @Field()
  @Column()
  status: string;

  @Field(() => [String], { nullable: true })
  @Column('simple-array', { nullable: true })
  categories: string[];

  @Field(() => Date, { nullable: true })
  @Column({ nullable: true })
  ticketPurchaseDeadline: Date;

  // Nota: Para campos opcionales o campos con tipos específicos, especificar el tipo de retorno adecuado y si son nullable.
  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  refundPolicy: string;

  @Field(() => [String], { nullable: true })
  @Column('simple-array', { nullable: true })
  socialLinks: string[];

  @Field(() => Int)
  @Column({ default: 0 })
  rating: number;

  @Field(() => Int)
  @Column('int', { default: 0 })
  availableTickets: number;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  ageRestriction: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  organizerContact: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  accessibilityInfo: string;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => [String], { nullable: true })
  @Column('simple-array', { nullable: true })
  documents: string[];

  @OneToMany(() => Ticket, (ticket) => ticket.event, { cascade: true })
  tickets: Ticket[];
}
