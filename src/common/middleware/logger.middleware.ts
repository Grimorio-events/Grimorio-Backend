import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

//  Esto te permitirá ver si el token de autenticación se está enviando correctamente en el header Authorization.
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`Incoming Request: ${req.method} ${req.path}`);
    // console.log(`Authorization Header: ${req.headers.authorization}`); // Solo para debugger (token)
    console.log(`Authorization Header: ${req.headers['x-session-id']}`); // sessionId del usuario
    next();
  }
}
