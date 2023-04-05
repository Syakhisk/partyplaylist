import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-firebase-jwt';
import * as admin from 'firebase-admin';
import { FirebaseAdmin } from 'src/authorization/firebase/firebase';

@Injectable()
export class FirebaseStrategy extends PassportStrategy(
  Strategy,
  'firebase-auth',
) {
  constructor(@Inject(FirebaseAdmin) private readonly firebase: FirebaseAdmin) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(token: string): Promise<admin.auth.DecodedIdToken> {
    const firebaseUser = await this.firebase.app
      .auth()
      .verifyIdToken(token, true)
      .catch((e: Error) => {
        throw new UnauthorizedException(e.message);
      });
    if (!firebaseUser) throw new UnauthorizedException();
    return firebaseUser;
  }
}
