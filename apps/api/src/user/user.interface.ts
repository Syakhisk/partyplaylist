import { CreateUserDTO } from 'src/user/dtos/createUser.dto';

export interface IUserService {
  create(createUser: CreateUserDTO): Promise<CreateUserDTO>;
}
export interface IUserRepository {
  checkUserAvaibility(uid: string): Promise<void>;
}
