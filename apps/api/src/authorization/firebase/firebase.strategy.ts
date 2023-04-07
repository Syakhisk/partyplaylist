import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-firebase-jwt';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseStrategy extends PassportStrategy(
  Strategy,
  'firebase-auth',
) {
  private firebaseApp: admin.app.App;
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.cert('./service-account.json'),
    });
  }

  async validate(token: string): Promise<admin.auth.DecodedIdToken> {
    const firebaseUser = await this.firebaseApp
      .auth()
      .verifyIdToken(token, true)
      .catch((e: Error) => {
        throw new UnauthorizedException(e.message);
      });
    if (!firebaseUser) throw new UnauthorizedException();
    return firebaseUser;
  }
}
