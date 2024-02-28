import { Controller, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { ClerkService } from 'src/clerk/clerk.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private clerkService: ClerkService,
  ) {}

  // Obetenemos datos del usuario a Clerk.
  @Get('clerk/:id')
  async getUserById(@Param('id') userId: string): Promise<User> {
    return this.clerkService.getUserById(userId);
  }

  // ACtualizamos datos del usuario. (pendiente)
  @Put(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  // Eliminamos datos del usuario. (pendiente)
  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<void> {
    return this.usersService.remove(id);
  }
}
