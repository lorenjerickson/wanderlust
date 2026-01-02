import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  ConnectedSocket,
  Ack,
} from '@nestjs/websockets'
import { from, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Server, Socket } from 'socket.io'

type ClientState<T = any> = {
  timestamp: number
  clientId: number
  data: T
}

type ServerState<T = any> = {
  timestamp: number
  data: T
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server

  @SubscribeMessage('client-state')
  handleClientState(
    @MessageBody() data: ClientState,
    @ConnectedSocket() client: Socket,
    @Ack() ack: (response: { status: string; data: ServerState }) => void,
  ) {
    const serverState: ServerState = {
      timestamp: Date.now(),
      data: { receivedClientId: data.clientId, message: 'State received' },
    }

    ack({ status: 'ok', data: serverState })
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data
  }
}
