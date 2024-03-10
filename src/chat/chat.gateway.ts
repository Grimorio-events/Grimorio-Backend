import {
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ClerkService } from 'src/clerk/clerk.service';
import { SendMessageDto } from './dto/send-message.dto';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection {
  private userSockets = new Map<string, string>(); // Mapa de IDs de usuario a IDs de socket

  setServerAdapter(adapter: any) {
    this.server.adapter(adapter);
  }

  constructor(
    private clerkService: ClerkService,
    private chatService: ChatService,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('authenticate')
  async handleAuthenticate(client: Socket, sessionId: string): Promise<void> {
    try {
      const session = await this.clerkService.verifySession(sessionId);
      console.log('🚀 ~ ChatGateway ~ session:', session);
      if (session) {
        const userId = session.user_id;
        const clientId = client.id;
        this.registerUserSocket(userId, clientId);
      } else {
        throw new Error('Invalid session');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      client.disconnect();
    }
  }

  private registerUserSocket(userId: string, socketId: string) {
    this.userSockets.set(userId, socketId);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    client: Socket,
    message: SendMessageDto,
  ): Promise<void> {
    try {
      // Guarda el mensaje en la base de datos
      const savedMessage = await this.chatService.saveMessage(
        message.senderId,
        message.receiverId,
        message.text,
        message.roomId,
      );

      // Busca el socketId del destinatario
      const receiverSocketId = this.userSockets.get(message.receiverId);

      // Si el destinatario está conectado (socketId encontrado), emite el mensaje
      if (receiverSocketId) {
        console.log(`🚀 ~ Mensaje a ${receiverSocketId}:`, savedMessage);
        this.server.to(receiverSocketId).emit('message', savedMessage);
      }
    } catch (error) {
      console.error('Error handling sendMessage:', error);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleConnection(client: Socket) {
    console.log(`🚀 ~ Cliente conectado: ${client.id}`);
    // Opcional: Agregar lógica cuando un cliente se conecta
    // Por ahora, se puede dejar vacío o agregar lógica de registro si es necesario.
  }

  handleDisconnect(client: Socket) {
    // Eliminar el socket ID del mapa cuando el cliente se desconecta
    const entry = Array.from(this.userSockets.entries()).find(
      (entry) => entry[1] === client.id,
    );
    if (entry) {
      this.userSockets.delete(entry[0]);
    }
  }
}
