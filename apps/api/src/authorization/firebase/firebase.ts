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
  verifyToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    return this.firebaseApp.auth().verifyIdToken(idToken, true);
  }
  getUserByUID(uid: string): Promise<admin.auth.UserRecord> {
    return this.firebaseApp.auth().getUser(uid);
  }
  async getUsersByUID(uids: string[]): Promise<admin.auth.GetUsersResult> {
    if (uids.length > 100) {
      let uidsSplitter: string[][];
      for (let i = 100; i < uids.length; i += 100) {
        uidsSplitter.push(uids.slice(i - 100, i));
      }
      let promises: Promise<admin.auth.GetUsersResult>[];
      for (const normalizedUids of uidsSplitter) {
        promises.push(
          this.firebaseApp
            .auth()
            .getUsers(normalizedUids.map((uid) => ({ uid }))),
        );
      }
      const users = await Promise.all(promises);
      let usersResult: admin.auth.GetUsersResult;
      for (const user of users) {
        usersResult.users.push(...user.users);
        usersResult.notFound.push(...user.notFound);
      }
      return usersResult;
    }
    return this.firebaseApp.auth().getUsers(uids.map((uid) => ({ uid })));
  }
}
