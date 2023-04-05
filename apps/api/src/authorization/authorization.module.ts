import { Module } from '@nestjs/common';
import { FirebaseAdmin } from 'src/authorization/firebase/firebase';
import { FirebaseAuthGuard } from 'src/authorization/firebase/firebase.guard';
import { FirebaseStrategy } from 'src/authorization/firebase/firebase.strategy';

@Module({
  providers: [FirebaseAuthGuard, FirebaseStrategy, FirebaseAdmin],
  exports: [FirebaseAuthGuard, FirebaseAdmin],
})
export class AuthorizationModule {}
