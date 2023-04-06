import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDTO } from 'src/user/dtos/createUser.dto';
import { CreatedUserDTO } from 'src/user/dtos/createdUser.dto';
import { IUserService } from 'src/user/user.interface';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(UserRepository) private readonly userRepo: UserRepository,
  ) {}

  async create(createUser: CreateUserDTO): Promise<CreatedUserDTO> {
    await this.userRepo.checkUserAvaibility(createUser.uid);
    return this.userRepo.createUser(createUser.uid);
  }
}
