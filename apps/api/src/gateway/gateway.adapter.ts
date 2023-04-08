import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';
import { FirebaseAdmin } from 'src/authorization/firebase/firebase';
import { AuthenticatedSocket } from 'src/gateway/gateway.type';
import { UserRepository } from 'src/user/user.repository';

export class WebsocketAdapter extends IoAdapter {
  private firebase: FirebaseAdmin;
  private userRepo: UserRepository;
  constructor(app: INestApplicationContext) {
    super(app);
    app.resolve<FirebaseAdmin>(FirebaseAdmin).then((firebaseadmin) => {
      this.firebase = firebaseadmin;
    });
    app.resolve<UserRepository>(UserRepository).then((userRepo) => {
      this.userRepo = userRepo;
    });
  }
  createIOServer(port: number, options?: ServerOptions): Server {
    const server = super.createIOServer(port, options) as Server;
    server.use(async (socket, next) => {
      const token = socket.handshake.auth.token;
      const firebaseUser = await this.firebase
        .app()
        .auth()
        .verifyIdToken(token, true)
        .catch((e: Error) => {
          next(new Error(e.message));
        });
      if (!firebaseUser) {
        return next(new Error('unauthorized'));
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await this.userRepo.checkUserExist(firebaseUser.uid).catch(() => {
        next(new Error('authorized but not exists, post first'));
      });
      (socket as AuthenticatedSocket).userId = firebaseUser.uid;
      next();
    });
    return server;
  }
}
