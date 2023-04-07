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
import { auth } from 'firebase-admin';
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
