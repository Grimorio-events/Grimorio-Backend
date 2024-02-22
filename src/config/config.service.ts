import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get databaseHost(): string {
    return this.configService.get<string>('DB_HOST', 'localhost');
  }

  get databasePort(): number {
    return this.configService.get<number>('DB_PORT', 5432);
  }

  get databaseUsername(): string {
    return this.configService.get<string>('DB_USERNAME', 'postgres');
  }

  get databasePassword(): string {
    return this.configService.get<string>('DB_PASSWORD', 'Cp0325Ta0812');
  }

  get databaseName(): string {
    const env = this.nodeEnv;
    if (env === 'test') {
      return this.configService.get<string>(
        'DB_DATABASE_TEST',
        'grimorio_test',
      );
    } else if (env === 'production') {
      return this.configService.get<string>(
        'DB_DATABASE_PRODUCTION',
        'grimorio',
      );
    }
    return this.configService.get<string>('DB_DATABASE', 'grimorio.db');
  }

  // Configurar JWT si es necesario (En revision)
  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET', '');
  }

  get allowedOrigins(): string {
    return this.configService.get<string>(
      'ALLOWED_ORIGINS',
      'http://localhost:3000',
    );
  }

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV', 'development');
  }

  // Método para determinar si el entorno actual es de producción
  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }
}
