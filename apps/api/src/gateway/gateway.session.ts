import { Injectable } from '@nestjs/common';
import { AuthenticatedSocket } from 'src/gateway/gateway.type';

@Injectable()
export class GatewaySessionManager {
  private readonly sessions: Map<string, AuthenticatedSocket> = new Map();

  getUserSocket(uid: string) {
    return this.sessions.get(uid);
  }
  setUserSocket(uid: string, socket: AuthenticatedSocket) {
    this.sessions.set(uid, socket);
  }
  removeUserSocket(uid: string) {
    this.sessions.delete(uid);
  }
  joinRoom(uid: string, roomName: string) {
    const socket = this.getUserSocket(uid);
    if (!socket) return;
    socket.join(roomName);
    this.setUserSocket(uid, socket);
  }
  leaveRoom(uid: string, roomName: string) {
    const socket = this.getUserSocket(uid);
    if (!socket) return;
    socket.leave(roomName);
    this.setUserSocket(uid, socket);
  }
}
