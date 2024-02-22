import {
  Controller,
  Patch,
  Param,
  Body,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { AssignTicketDto } from './dto/assign-ticket.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @UseGuards(AuthGuard('jwt'))
  @Patch(':ticketId/assign-user')
  async assignUserToTicket(
    @Param('ticketId', ParseUUIDPipe) ticketId: string,
    @Body() assignTicketDto: AssignTicketDto,
  ) {
    return this.ticketService.assignUserToTicket(
      ticketId,
      assignTicketDto.userId,
    );
  }
}
