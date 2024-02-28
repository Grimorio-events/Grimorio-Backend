import { Resolver, Query } from '@nestjs/graphql';
import { EventService } from './event.service';
import { Event } from './event.entity';

@Resolver(() => Event) // Simplificado, eliminando la variable 'of'
export class EventResolver {
  constructor(private eventService: EventService) {}

  @Query(() => [Event], { nullable: 'items' }) // Simplificado, eliminando la variable 'returns'. 'nullable: items' permite listas vacías.
  async events(): Promise<Event[]> {
    return this.eventService.findAll();
  }
}
