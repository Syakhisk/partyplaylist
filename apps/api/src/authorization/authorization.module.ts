import { Module } from '@nestjs/common';
import { FirebaseAuthGuard } from 'src/authorization/firebase/firebase.guard';
import { FirebaseStrategy } from 'src/authorization/firebase/firebase.strategy';

@Module({
  providers: [FirebaseAuthGuard, FirebaseStrategy],
  exports: [FirebaseAuthGuard],
})
export class AuthorizationModule {}
