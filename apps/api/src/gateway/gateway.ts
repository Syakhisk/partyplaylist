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
  cors: true,
})
export class MessagingGateway
  implements
    OnGatewayConnection<AuthenticatedSocket>,
    OnGatewayDisconnect<AuthenticatedSocket>
{
  constructor(
    @Inject(GatewaySessionManager)
    private readonly gatewaySession: GatewaySessionManager,
    private eventEmitter: EventEmitter2,
  ) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: AuthenticatedSocket) {
    console.log(`connection incoming from ${client.userId}`);
    this.gatewaySession.setUserSocket(client.userId, client);
  }

  async handleDisconnect(client: AuthenticatedSocket) {
    console.log(`connection lost from ${client.userId}`);
    await this.eventEmitter.emitAsync(ServerEvent.UserOffline, {
      uid: client.userId,
    } as ServerEventPayload[ServerEvent.UserOffline]);

    this.gatewaySession.removeUserSocket(client.userId);
  }

  @SubscribeMessage(WebsocketEvent.PlayerPlay)
  async handlePlayerPlay(client: AuthenticatedSocket) {
    await this.eventEmitter.emitAsync(ServerEvent.PlayerPlaying, {
      uid: client.userId,
    } as ServerEventPayload[ServerEvent.PlayerPlaying]);
  }
}
