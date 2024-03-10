import { Args, Query, Resolver } from '@nestjs/graphql';
import { Message } from './chat.entity';
import { ChatService } from './chat.service';

@Resolver(() => Message)
export class ChatResolver {
  constructor(private chatService: ChatService) {}

  @Query(() => [Message], { nullable: 'itemsAndList' }) // Permite tanto listas vacías como elementos nulos dentro de la lista.
  async chatRooms(
    @Args('roomIds', { type: () => [String] }) roomIds: string[],
  ): Promise<Message[]> {
    return this.chatService.getAllChatsRooms(roomIds);
  }
}
