import { Resolver, Query, Args } from '@nestjs/graphql';
import { EventService } from './event.service';
import { Event } from './event.entity';

@Resolver(() => Event)
export class EventResolver {
  constructor(private eventService: EventService) {}

  @Query(() => [Event], { nullable: 'items' }) // Eliminando la variable 'returns'. 'nullable: items' permite listas vacías.
  async events(): Promise<Event[]> {
    return this.eventService.findAll();
  }

  @Query(() => Event, { nullable: true })
  async event(
    @Args('id', { type: () => String }) id: string,
  ): Promise<Event | null> {
    console.log(`Buscando evento con id: ${id}`);
    return this.eventService.findOne(id);
  }
}
