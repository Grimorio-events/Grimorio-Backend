import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { HealthController } from './health/health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { EventModule } from './event/event.module';
import { TicketController } from './ticket/ticket.controller';
import { TicketService } from './ticket/ticket.service';
import { TicketModule } from './ticket/ticket.module';
import { EventService } from './event/event.service';
import { EventController } from './event/event.controller';
import { ClerkModule } from './clerk/clerk.module';
import { ClerkAuthGuard } from './clerk/clerk-auth.guard';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/graphql-schema.gql'),
      // Habilitar suscripciones si es necesario
      subscriptions: { 'graphql-ws': false },
      sortSchema: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true, // Hace que las variables de entorno estén disponibles globalmente
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'Salomon',
        password: 'Gandiva521',
        database: 'eventos_db',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: process.env.NODE_ENV !== 'production', // IMPORTANTE: estar en FALSE cuando salga a produccion.
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    TerminusModule,
    AuthModule,
    EventModule,
    TicketModule,
    ClerkModule,
  ],
  controllers: [
    AppController,
    HealthController,
    TicketController,
    EventController,
  ],
  providers: [AppService, TicketService, EventService, ClerkAuthGuard],
})
export class AppModule {}
