// chat.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './chat.entity';
import { Brackets, Repository } from 'typeorm';
import { Server } from 'socket.io';

@Injectable()
export class ChatService {
  private server: Server;
  private userSockets = new Map<string, string>(); // Mapea IDs de usuario a IDs de socket

  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  setServer(server: Server) {
    this.server = server;
  }

  registerUserSocket(userId: string, socketId: string) {
    const response = this.userSockets.set(userId, socketId);
    return response;
  }

  // Guardamos los mensajes enviados (para Usar el Repositorio de Mensajes)
  async saveMessage(
    senderId: string,
    receiverId: string,
    text: string,
    roomId?: string,
  ): Promise<Message> {
    const newMessage = this.messageRepository.create({
      senderId,
      receiverId,
      text,
      roomId,
    });
    return this.messageRepository.save(newMessage);
  }

  async emitMessage(userId: string, message: any) {
    const socketId = this.userSockets.get(userId);
    if (socketId && this.server) {
      this.server.to(socketId).emit('message', message);
    }
  }

  // Busqueda del room entre dos usiarios
  async findRoomBetweenUsers(
    userId: string,
    ownerId: string,
  ): Promise<Message | null> {
    const message = await this.messageRepository
      .createQueryBuilder('message')
      .where('message.senderId = :userId', { userId })
      .andWhere('message.receiverId = :ownerId', { ownerId })
      .orWhere(
        new Brackets((qb) => {
          qb.where('message.senderId = :ownerId', { ownerId }).andWhere(
            'message.receiverId = :userId',
            { userId },
          );
        }),
      )
      .getOne(); // Solo puede existir una conversación activa entre estos dos usuarios

    console.log('🚀 ~ ChatService ~ message:', message);
    return message; // Retorna el mensaje que encuentres o null si no hay ninguno
  }

  // Crear una nueva conversacion
  async createConversation(
    senderId: string,
    receiverId: string,
    roomId: string,
  ): Promise<Message> {
    // Crea un nuevo registro de mensaje usando el repositorio
    const newMessage = this.messageRepository.create({
      senderId,
      receiverId,
      text: '', // Puede ser un string vacío si no se desea un mensaje inicial
      roomId,
    });

    // Guarda el nuevo mensaje en la base de datos
    await this.messageRepository.save(newMessage);

    console.log('🚀 ~ ChatService ~ createConversation:', newMessage);
    return newMessage; // Retorna el nuevo mensaje creado
  }

  // Traemos los registros de los chats
  async getAllChatsRooms(roomIds: string[]): Promise<Message[]> {
    const allRooms = await this.messageRepository
      .createQueryBuilder('message')
      .where('message.roomId IN (:...roomIds)', { roomIds })
      .getMany();
    console.log('🚀 ~ ChatService ~ GetAllRooms:', allRooms);
    return allRooms;
  }
}
