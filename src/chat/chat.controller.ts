import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ClerkAuthGuard } from 'src/clerk/clerk-auth.guard';
import { SendMessageDto } from './dto/send-message.dto';
import { FindRoomDto } from './dto/find-room.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { ClerkService } from 'src/clerk/clerk.service';
import { GetRoomsDto } from './dto/get-rooms.dto';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private clerkService: ClerkService,
  ) {}

  // Lógica de Guardar y Emitir Mensajes
  @Post('send')
  @UseGuards(ClerkAuthGuard)
  async sendMessage(
    @Request() req,
    @Body() messageDto: SendMessageDto,
  ): Promise<any> {
    const userId = req.user.id;
    const { receiverId, text, roomId } = messageDto;

    // Guardar el mensaje en la base de datos
    const saveMessage = await this.chatService.saveMessage(
      userId,
      receiverId,
      text,
      roomId,
    );

    // Emitir el mensaje al destinatario (esto requerirá integración con Socket.IO)
    this.chatService.emitMessage(receiverId, saveMessage);

    return saveMessage;
  }

  // Buscamos si existe algun roomId con los usuarios ya existentes
  @Post('find-room')
  @UseGuards(ClerkAuthGuard)
  async findRoomBetweenUsers(
    @Request() req,
    @Body() usersDto: FindRoomDto,
  ): Promise<any> {
    const { userId, ownerId } = usersDto; // Estos son los IDs de los usuarios involucrados
    return this.chatService.findRoomBetweenUsers(userId, ownerId);
  }

  @Post('create-room')
  @UseGuards(ClerkAuthGuard)
  async createRoomBetweenUsers(
    @Request() req,
    @Body() roomDto: CreateRoomDto,
  ): Promise<any> {
    const { userId, ownerId, roomId } = roomDto;

    const newConversation = await this.chatService.createConversation(
      userId,
      ownerId,
      roomId,
    );

    // actualiza el roomId en los unsafeMetadata de ambos usuarios usando Clerk
    await this.clerkService.updateUserByIdRoomId(userId, roomId); // Actualiza el remitente
    await this.clerkService.updateUserByIdRoomId(ownerId, roomId); // Actualiza el receptor

    return newConversation; // Retorna la nueva conversación creada
  }

  @Post('get-chatRooms')
  @UseGuards(ClerkAuthGuard)
  async getMessagesByRoomIds(@Body() getRoomsDto: GetRoomsDto) {
    return this.chatService.getAllChatsRooms(getRoomsDto.roomIds);
  }
}
