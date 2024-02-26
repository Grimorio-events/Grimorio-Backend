import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { ClerkModule } from 'src/clerk/clerk.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ClerkModule],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
