import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { IUserRepository } from 'src/users/user.interface';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async findUserByEmail(email: string): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser)
      throw new HttpException('User already exists', HttpStatus.CONFLICT);

    return existingUser;
  }
  async createUser(user: DeepPartial<User>): Promise<User> {
    return this.userRepository.save(user);
  }
}
