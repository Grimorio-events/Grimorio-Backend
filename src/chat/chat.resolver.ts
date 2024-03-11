import { Args, Query, Resolver } from '@nestjs/graphql';
import { Message } from './chat.entity';
import { ChatService } from './chat.service';

@Resolver(() => Message)
export class ChatResolver {
  constructor(private chatService: ChatService) {}

  // @Query(() => [Message], { nullable: 'itemsAndList' })
  // async uniqueChats(
  //   @Args('roomId', { type: () => String }) roomId: string,
  // ): Promise<Message[]> {
  //   return this.chatService.getUniqueChatsByRoom(roomId);
  // }

  @Query(() => [Message], { nullable: 'itemsAndList' })
  async latestMessagesByRooms(
    @Args('roomIds', { type: () => [String] }) roomIds: string[], // Define roomIds como un array de strings
  ): Promise<Message[]> {
    return this.chatService.getLatestMessagesByRooms(roomIds);
  }

  @Query(() => [Message], { nullable: 'itemsAndList' })
  async chatRoom(
    @Args('roomId', { type: () => String }) roomId: string,
  ): Promise<Message[]> {
    return this.chatService.getAllChatRoom(roomId);
  }
}
