import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ClerkService {
  private readonly clerkAxiosInstance = axios.create({
    baseURL: 'https://api.clerk.dev/v1',
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  async getUserById(userId: string) {
    try {
      const response = await this.clerkAxiosInstance.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user from Clerk:', error);
      throw new Error('Failed to fetch user from Clerk');
    }
  }

  // ACtualizamos usuario con el nuevo roomId
  async updateUserByIdRoomId(userId: string, roomId: string) {
    try {
      // Obtenemos el usuario actual para revisar su unsafeMetadata
      const user = await this.getUserById(userId);

      const currentRoomIds =
        user.unsafe_metadata && user.unsafe_metadata.roomId
          ? user.unsafe_metadata.roomId
          : [];

      // Agrega el nuevo roomId al array si aún no existe
      const updatedRoomIds = currentRoomIds.includes(roomId)
        ? currentRoomIds
        : [...currentRoomIds, roomId];

      // Actualizamos el usuario con los nuevos roomIds
      const response = await this.clerkAxiosInstance.patch(`/users/${userId}`, {
        unsafe_metadata: { roomId: updatedRoomIds },
      });

      return response.data;
    } catch (error) {
      console.error('Failed to update user from Clerk:', error);
      throw new Error('Failed to update user from Clerk');
    }
  }

  async verifySession(sessionId: string) {
    try {
      const response = await this.clerkAxiosInstance.get(
        `/sessions/${sessionId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error('Error verificando la sesión con Clerk:', error);
      throw new Error('Error verificando la sesión con Clerk');
    }
  }
}
