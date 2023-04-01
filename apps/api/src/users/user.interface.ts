import { CreateUserByEmailDTO } from 'src/users/dtos/createUserByEmail.dto';
import { CreatedUserDTO } from 'src/users/dtos/createdUser.dto';
import { User } from 'src/users/entities/user.entity';

export interface IUserService {
  createByEmail(createUser: CreateUserByEmailDTO): Promise<CreatedUserDTO>;
}

export interface IUserRepository {
  findUserByEmail(email: string): Promise<User>;
  createUser(user: User): Promise<User>;
}
