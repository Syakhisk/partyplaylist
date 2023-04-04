import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { security } from 'src/security/security.interface';

@Injectable()
export class BcryptPasswordHash implements security {
  async hashPassword(rawPassword: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(rawPassword, salt);
  }
  async comparePassword(password: string, hash: string): Promise<void> {
    const result = await bcrypt.compare(password, hash);
    if (!result) {
      throw new HttpException('invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }
}
