import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreatedUserDTOResponse } from 'src/user/dtos/createdUser.dto';
import { UserService } from 'src/user/user.service';
import { CreateUserDTO } from 'src/user/dtos/createUser.dto';
import { FirebaseAuthGuard } from 'src/authorization/firebase/firebase.guard';
import { auth } from 'firebase-admin';
import { SwaggerMethods } from 'src/common/decorator/swagger.decorator';
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
  @SwaggerMethods({
    operation: {
      summary: 'register user',
      description: 'register user from firebase to our db',
    },
    body: {
      type: CreateUserDTO,
    },
    responses: [
      { status: HttpStatus.CREATED, type: CreatedUserDTOResponse },
      {
        status: HttpStatus.ACCEPTED,
        description: 'user already registered in a db',
      },
      { status: HttpStatus.UNAUTHORIZED, description: 'not having a token' },
      {
        status: HttpStatus.FORBIDDEN,
        description: 'invalid token or body and request header not the same',
      },
    ],
  })
  @UseGuards(FirebaseAuthGuard)
  async postUserHandler(
    @Req() request: { user: auth.DecodedIdToken },
    @Body() payload: CreateUserDTO,
  ): Promise<CreatedUserDTOResponse> {
    UserController.validate(payload.uid, request.user.uid);
    const createdUser = await this.userService.create(payload);
    return {
      data: {
        uid: createdUser.uid,
      },
    };
  }
  private static validate(payloadUid: string, requestUid: string): void {
    if (payloadUid !== requestUid)
      throw new HttpException(
        { message: 'not the same user' },
        HttpStatus.FORBIDDEN,
      );
  }
}
