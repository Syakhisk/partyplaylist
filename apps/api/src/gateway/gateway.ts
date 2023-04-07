import { Inject } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import {
  ServerEvent,
  ServerEventPayload,
} from 'src/common/constant/serverEvent.constant';
import { WebsocketEvent } from 'src/common/constant/websocket.constant';
import { GatewaySessionManager } from 'src/gateway/gateway.session';
import { AuthenticatedSocket } from 'src/gateway/gateway.type';
@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
  pingInterval: 10000,
  pingTimeout: 15000,
})
export class MessagingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject(GatewaySessionManager)
    private readonly gatewaySession: GatewaySessionManager,
    private eventEmitter: EventEmitter2,
  ) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: AuthenticatedSocket) {
    this.gatewaySession.setUserSocket(client.userId, client);
  }
  async handleDisconnect(client: AuthenticatedSocket) {
    const payload: ServerEventPayload[ServerEvent.UserOffline] = {
      uid: client.userId,
    };
    await this.eventEmitter.emitAsync(ServerEvent.UserOffline, payload);
    this.gatewaySession.removeUserSocket(client.userId);
  }

  @SubscribeMessage(WebsocketEvent.PlayerPlay)
  async handlePlayerPlay(client: AuthenticatedSocket) {
    const payload: ServerEventPayload[ServerEvent.PlayerPlaying] = {
      uid: client.userId,
    };
    await this.eventEmitter.emitAsync(ServerEvent.PlayerPlaying, payload);
  }
}
