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
    const savedMessage = this.messageRepository.save(newMessage);
    return savedMessage;
  }

  async emitMessage(receiverId: string, message: any) {
    const socketId = this.userSockets.get(receiverId);
    if (socketId && this.server) {
      this.server.to(socketId).emit('message', message);

      // Escuchar la confirmación de recepción del receptor
      this.server.once('message-received', (confirmation) => {
        const senderSocketId = this.userSockets.get(message.senderId);
        if (senderSocketId) {
          this.server
            .to(senderSocketId)
            .emit('message-confirmed', confirmation);
        }
      });
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

  // Traemos los chat existentes por usuario
  // async getUniqueChatsByRoom(
  //   roomId: string,
  //   // senderId: string,
  // ): Promise<Message[]> {
  //   // Primero, obtenemos el ID del mensaje más reciente para cada combinación única de roomId y senderId
  //   const latestMessage = await this.messageRepository
  //     .createQueryBuilder('message')
  //     .select('MAX(message.id)', 'id')
  //     .where('message.roomId = :roomId', {
  //       roomId,
  //     })
  //     .getRawOne();

  //   // Si no encontramos un mensaje, retornamos un arreglo vacío
  //   if (!latestMessage) return [];

  //   // Luego, recuperamos el registro completo para ese ID
  //   return this.messageRepository
  //     .createQueryBuilder('message')
  //     .where('message.id = :id', { id: latestMessage.id })
  //     .getMany();
  // }

  // Traemos los chats con el ultimo mensaje
  async getLatestMessagesByRooms(roomIds: string[]): Promise<Message[]> {
    // Utiliza una función de ventana o una subconsulta para obtener los IDs de los últimos mensajes por cada roomId
    const latestMessagesIds = await this.messageRepository
      .createQueryBuilder('message')
      .select('MAX(message.id)', 'id') // O usa MAX(message.createdAt) si prefieres basarte en la fecha
      .where('message.roomId IN (:...roomIds)', { roomIds })
      .groupBy('message.roomId')
      .getRawMany();

    if (!latestMessagesIds.length) {
      return [];
    }

    // Convierte la lista de IDs de mensajes en un array de IDs
    const ids = latestMessagesIds.map((m) => m.id);

    // Recupera y devuelve los mensajes completos para los IDs identificados
    return this.messageRepository
      .createQueryBuilder('message')
      .where('message.id IN (:...ids)', { ids })
      .getMany();
  }

  // Traemos el registros del chat
  async getAllChatRoom(roomId: string): Promise<Message[]> {
    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .where('message.roomId = :roomId', { roomId })
      .getMany();

    return messages;
  }
}
