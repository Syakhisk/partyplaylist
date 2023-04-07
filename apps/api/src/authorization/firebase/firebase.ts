import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
@Injectable()
export class FirebaseAdmin {
  private readonly firebaseApp: admin.app.App;
  constructor() {
    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.cert('./service-account.json'),
    });
  }
  app(): admin.app.App {
    return this.firebaseApp;
  }
}
