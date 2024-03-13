import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('LoggerMiddleware');

  use(req: Request, res: Response, next: NextFunction) {
    console.log('LoggerMiddleware executed');
    console.log(`Incoming Request: ${req.method} ${req.path}`);
    console.log(`Authorization Header: ${req.headers['x-session-id']}`); // sessionId del usuario

    // Register a listener for unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      this.logger.error(
        `Unhandled Promise Rejection at: ${promise}, reason: ${reason}`,
      );
    });

    // Register a listener for uncaught exceptions
    process.on('uncaughtException', (error) => {
      this.logger.error(`Uncaught Exception: ${error}`);
      process.exit(1); // Exit the process after logging the uncaught exception
    });

    // Register a listener for unhandled exceptions
    process.on('unhandledException', (error) => {
      this.logger.error(`Unhandled Exception: ${error}`);
    });

    // Continue with the request processing
    next();
  }
}
