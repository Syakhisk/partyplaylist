import { Inject, Injectable } from '@nestjs/common';
import { BcryptPasswordHash } from 'src/security/bcrypt/bcryptSecurity.service';
import { CreateUserByEmailDTO } from 'src/users/dtos/createUserByEmail.dto';
import { CreatedUserDTO } from 'src/users/dtos/createdUser.dto';
import { IUserService } from 'src/users/user.interface';
import { UserRepository } from 'src/users/user.repository';
import { FileRepository } from 'src/files/file.repository';
@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(UserRepository) private readonly userRepo: UserRepository,
    @Inject(FileRepository) private readonly fileRepo: FileRepository,
    @Inject(BcryptPasswordHash)
    private readonly passwordHash: BcryptPasswordHash,
  ) {}

  public async createByEmail(
    createUser: CreateUserByEmailDTO,
  ): Promise<CreatedUserDTO> {
    await this.userRepo.findUserByEmail(createUser.email);
    createUser.password = await this.passwordHash.hashPassword(
      createUser.password,
    );
    const fileEntity = await this.fileRepo.findFileById(createUser.photoUUID);
    const insertedResult = await this.userRepo.createUser({
      ...createUser,
      photo: fileEntity,
    });

    return {
      id: insertedResult.id,
    };
  }
}
