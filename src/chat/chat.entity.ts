import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Message {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  senderId: string;

  @Field()
  @Column()
  receiverId: string;

  @Field()
  @Column()
  text: string;

  @Field()
  @Column({ nullable: true })
  roomId?: string;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;
}
