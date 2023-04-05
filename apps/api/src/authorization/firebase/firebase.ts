import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
@Injectable()
export class FirebaseAdmin {
  public app: admin.app.App;
  constructor() {
    this.app = admin.initializeApp({
      credential: admin.credential.cert(
        './personal-projects-00-firebase-adminsdk-.json',
      ),
    });
  }
}
