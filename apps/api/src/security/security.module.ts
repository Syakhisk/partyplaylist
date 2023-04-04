import { Module } from '@nestjs/common';
import { BcryptPasswordHash } from 'src/security/bcrypt/bcryptSecurity.service';

@Module({
  providers: [BcryptPasswordHash],
  exports: [BcryptPasswordHash],
})
export class SecurityModule {}
