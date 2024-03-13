import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

async function bootstrap() {
  console.log('Starting application bootstrap');
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Enable CORS
  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(['log', 'warn', 'error']); // Adjust to show warnings and errors

  app.use(new LoggerMiddleware().use); // Registro del middleware a nivel de la app

  await app.listen(8080);
}
bootstrap();
