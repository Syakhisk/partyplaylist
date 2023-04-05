import { Injectable } from '@nestjs/common';
import { auth } from 'firebase-admin';

@Injectable()
export class GatewaySessionManager {
  private readonly sessions: Map<string, auth.DecodedIdToken> = new Map();
  private readonly reverseSession: Map<auth.DecodedIdToken, string> = new Map();

  getUserSocket(sid: string) {
    return this.sessions.get(sid);
  }
  getConnectionUser(user: auth.DecodedIdToken) {
    return this.reverseSession.get(user);
  }

  setUserSocket(sid: string, user: auth.DecodedIdToken) {
    this.sessions.set(sid, user);
    this.reverseSession.set(user, sid);
  }
  removeUserSocket(sid: string) {
    const user = this.sessions.get(sid);
    this.sessions.delete(sid);
    this.reverseSession.set(user, sid);
  }
  getSockets(): Map<string, auth.DecodedIdToken> {
    return this.sessions;
  }
  getConnection(): Map<auth.DecodedIdToken, string> {
    return this.reverseSession;
  }
}
