import {
  Controller,
  Post,
  Inject,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { CreateUserByEmailDTO } from 'src/users/dtos/createUserByEmail.dto';
import { CreatedUserDTOResponse } from 'src/users/dtos/createdUser.dto';
import { UserService } from 'src/users/user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@Controller({
  path: 'users',
  version: '1',
})
export class UserController {
  constructor(@Inject(UserService) private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    type: CreatedUserDTOResponse,
    status: HttpStatus.CREATED,
  })
  async postUser(
    @Body() createUserByEmail: CreateUserByEmailDTO,
  ): Promise<CreatedUserDTOResponse> {
    const createdUser = await this.userService.createByEmail(createUserByEmail);
    return {
      data: createdUser,
    };
  }
}
