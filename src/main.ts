import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { RedisIoAdapter } from './common/adapters/redis-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // Configuracion de redis para el chat
  const redisIoAdapter = new RedisIoAdapter(app); // Configuracion de redis para el chat
  await redisIoAdapter.connectToRedis(); // Configuracion de redis para el chat
  app.useWebSocketAdapter(redisIoAdapter); // Configuracion de redis para el chat
  app.enableCors(); // Habilitamos CORS
  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(['warn', 'error']); // Ajusta para mostrar solo advertencias y errores
  app.use(new LoggerMiddleware().use); // Registro del middleware a nivel de la app
  await app.listen(3000);
}
bootstrap();
