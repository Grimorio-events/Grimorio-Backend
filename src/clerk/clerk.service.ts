import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ClerkService {
  private readonly clerkAxiosInstance = axios.create({
    baseURL: 'https://api.clerk.dev/v1',
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET}`,
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
}
