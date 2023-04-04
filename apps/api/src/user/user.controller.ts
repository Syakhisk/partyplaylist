import {
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { CreatedUserDTOResponse } from 'src/user/dtos/createdUser.dto';
import { UserService } from 'src/user/user.service';
import { FastifyRequest } from 'fastify';
import { CreateUserDTO } from 'src/user/dtos/createUser.dto';
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
  async postUserHandler(
    @Req() request: FastifyRequest<{ Body: CreateUserDTO }>,
  ): Promise<CreatedUserDTOResponse> {
    const createdUser = await this.userService.create(request.body);
    return {
      data: {
        uid: createdUser.uid,
      },
    };
  }
}
