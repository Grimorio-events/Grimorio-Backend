import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ClerkService } from './clerk.service';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(private clerkService: ClerkService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Obtenemos sessionId de los headers
    const sessionId = request.headers['x-session-id'];
    // Extraer el token de sesión del header de autorización
    const authHeader = request.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!sessionId || !token) {
      console.log('No session token provided');
      return false;
    }

    try {
      // Usamos ClerkService para verificar la sesión
      await this.clerkService.verifySession(sessionId);
      // Si la verificación es exitosa, puedes seguir con tu lógica
      // Por ejemplo, podrías adjuntar información de la sesión o del usuario al objeto request
      console.log('🚀 ~ La sesión con Clerk es exitosa ~ 🚀');
      return true;
    } catch (error) {
      console.log('🚀🚀🚀 ~ Error verificando la sesión con Clerk:', error);
      return false; // Denegar acceso si la sesión no es válida
    }
  }
}
