import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Habilitamos CORS
  app.useGlobalPipes(new ValidationPipe());
  app.use(new LoggerMiddleware().use); // Registro del middleware a nivel de la app
  await app.listen(3000);
}
bootstrap();
