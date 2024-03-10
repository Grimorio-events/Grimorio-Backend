// chat.module.ts
import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ClerkAuthGuard } from 'src/clerk/clerk-auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './chat.entity';
import { ClerkModule } from 'src/clerk/clerk.module';
import { ChatGateway } from './chat.gateway';
import { ChatResolver } from './chat.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), ClerkModule], // Registro de las entidades
  controllers: [ChatController],
  providers: [ChatService, ClerkAuthGuard, ChatGateway, ChatResolver],
  exports: [ChatGateway],
})
export class ChatModule {}
