import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { IUserRepository } from 'src/user/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async checkUserAvaibility(uid: string): Promise<void> {
    const existingUser = await this.userRepository.findOne({
      where: { uid },
    });
    if (existingUser)
      throw new HttpException(
        { message: 'User already exists' },
        HttpStatus.ACCEPTED,
      );
  }
  async createUser(uid: string): Promise<User> {
    return this.userRepository.save(this.userRepository.create({ uid }));
  }

  async checkUserExist(uid: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { uid },
    });
    if (user === null)
      throw new HttpException(
        {
          message: 'user not found',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
  }
}
