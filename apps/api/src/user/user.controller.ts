import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiBody,
} from '@nestjs/swagger';
import { CreatedUserDTOResponse } from 'src/user/dtos/createdUser.dto';
import { UserService } from 'src/user/user.service';
import { CreateUserDTO } from 'src/user/dtos/createUser.dto';
import { FirebaseAuthGuard } from 'src/authorization/firebase/firebase.guard';
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
  @ApiBody({
    type: CreateUserDTO,
  })
  @ApiCreatedResponse({
    type: CreatedUserDTOResponse,
    status: HttpStatus.CREATED,
  })
  @UseGuards(FirebaseAuthGuard)
  async postUserHandler(
    @Body() body: CreateUserDTO,
  ): Promise<CreatedUserDTOResponse> {
    const createdUser = await this.userService.create(body);
    return {
      data: {
        uid: createdUser.uid,
      },
    };
  }
}
