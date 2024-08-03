import { Body, Controller, Post } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { Participant } from '@wanderlust/core';

@Controller('api/participants')
export class ParticipantsController {
  constructor(private readonly service: ParticipantsService) {}

  @Post()
  async roles(@Body() body: Participant) {
    return await this.service.create(body);
  }
}
