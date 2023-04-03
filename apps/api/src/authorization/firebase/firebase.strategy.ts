import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { app, initializeApp, credential, auth } from 'firebase-admin';

@Injectable()
export class FirebaseStrategy extends PassportStrategy(
  Strategy,
  'firebase-auth',
) {
  private firebaseApp: app.App;
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
    this.firebaseApp = initializeApp({
      credential: credential.cert(
        './apps/api/personal-projects-00-firebase-adminsdk-i5dsc-0027d666be.json',
      ),
    });
  }

  async validate(token: string): Promise<auth.DecodedIdToken> {
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
