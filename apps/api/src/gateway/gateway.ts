import { Inject } from '@nestjs/common';
import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { GatewaySessionManager } from 'src/gateway/gateway.session';
@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3001'],
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
  ) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: any) {
    this.gatewaySession.setUserSocket(client.handshake.sid, client.user);
  }
  handleDisconnect(client: any) {
    this.gatewaySession.removeUserSocket(client.handshake.sid);
  }
}
