import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ClerkAuthGuard } from 'src/clerk/clerk-auth.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  // @UseGuards(ClerkAuthGuard) // Autenticación con Clerk
  @Post()
  async create(@Body() createEventDto: CreateEventDto) {
    console.log('Received eventData:', createEventDto);
    try {
      const createdEvent = await this.eventService.create(createEventDto);
      console.log('Created event:', createdEvent); // Registro de depuración
      return createdEvent;
    } catch (error) {
      console.error('Error creating event:', error); // Registro de error
      throw error; // Propaga el error para que pueda ser manejado por un filtro de excepciones
    }
  }

  @Get()
  findAll() {
    return this.eventService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  @UseGuards(ClerkAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    console.log('Route hit update request:', id, updateEventDto);
    return this.eventService.update(id, updateEventDto);
  }

  // @UseGuards(ClerkAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventService.remove(id);
  }

  // @UseGuards(ClerkAuthGuard)
  @Patch(':id/update-status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    console.log('Received update status request:', id, updateEventDto);

    try {
      const result = await this.eventService.updateStatus(
        id,
        updateEventDto.status,
      );
      console.log('Update status result:', result);
      return result;
    } catch (error) {
      console.error('Error updating status:', error);
      throw new BadRequestException('Invalid request data');
    }
  }

  // @UseGuards(ClerkAuthGuard)
  @Patch(':id/add-category')
  async addCategory(
    @Param('id') id: string,
    @Body('category') category: string,
  ) {
    return this.eventService.addCategory(id, category);
  }

  // @UseGuards(ClerkAuthGuard)
  @Patch(':id/remove-category')
  async removeCategory(
    @Param('id') id: string,
    @Body('category') category: string,
  ) {
    return this.eventService.removeCategory(id, category);
  }
}
