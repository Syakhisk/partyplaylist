import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { WsException } from '@nestjs/websockets';
import { ServerOptions } from 'socket.io';
import { FirebaseAdmin } from 'src/authorization/firebase/firebase';
import { UserRepository } from 'src/user/user.repository';

export class WebsocketAdapter extends IoAdapter {
  private firebase: FirebaseAdmin;
  private userRepo: UserRepository;
  constructor(private app: INestApplicationContext) {
    super(app);
    app.resolve<FirebaseAdmin>(FirebaseAdmin).then((firebaseadmin) => {
      this.firebase = firebaseadmin;
    });
    app.resolve<UserRepository>(UserRepository).then((userRepo) => {
      this.userRepo = userRepo;
    });
  }
  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.use(async (socket, next) => {
      const token = socket.handshake.auth.token;
      const firebaseUser = await this.firebase.app
        .auth()
        .verifyIdToken(token, true)
        .catch((e: Error) => {
          throw new WsException(e.message);
        });
      if (!firebaseUser) throw new WsException('unauthorized');
      await this.userRepo.checkUserExist(firebaseUser.uid).catch(() => {
        throw new WsException('authorized but not exists, post first');
      });
      socket.user = firebaseUser;
      next();
    });
    return server;
  }
}
