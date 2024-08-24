import { Module } from '@nestjs/common';
import { ParticipantsController } from './participants.controller';
import { ParticipantsService } from './participants.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, participantSchema } from './participants.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: participantSchema }]),
  ],
  controllers: [ParticipantsController],
  providers: [ParticipantsService],
  exports: [ParticipantsService],
})
export class ParticipantsModule {
  constructor() {}
}
