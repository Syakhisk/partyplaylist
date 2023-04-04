import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { IUserRepository } from 'src/user/user.interface';
import { Repository, DeepPartial } from 'typeorm';

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
        HttpStatus.CONFLICT,
      );
  }
  async createUser(user: DeepPartial<User>): Promise<User> {
    const createUser = this.userRepository.create(user);
    return this.userRepository.save(createUser);
  }
}
