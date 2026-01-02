import { Module } from '@nestjs/common'
import { EventsGateway } from './events.gateway.js'

@Module({
  exports: [EventsGateway],
  providers: [EventsGateway],
})
export class EventsModule {}
