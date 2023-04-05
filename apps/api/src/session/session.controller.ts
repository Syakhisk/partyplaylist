import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { auth } from 'firebase-admin';
import { FirebaseAuthGuard } from 'src/authorization/firebase/firebase.guard';
import { CreateSessionDTO } from 'src/session/dtos/createSession.dto';
import { CreatedSessionDTOResponse } from 'src/session/dtos/createdSession.dto';
import { SessionService } from 'src/session/session.service';

@ApiTags('session')
@ApiBearerAuth()
@Controller({
  path: 'sessions',
  version: '1',
})
export class SessionController {
  constructor(
    @Inject(SessionService) private readonly sessionService: SessionService,
  ) {}
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    type: CreateSessionDTO,
  })
  @ApiResponse({
    type: CreatedSessionDTOResponse,
    status: HttpStatus.CREATED,
  })
  @UseGuards(FirebaseAuthGuard)
  async postSessionHandler(
    @Req()
    request: {
      user: auth.DecodedIdToken;
    },
    @Body() payload: CreateSessionDTO,
  ): Promise<CreatedSessionDTOResponse> {
    const { code } = await this.sessionService.addNewSession({
      name: payload.name,
      userId: request.user.uid,
    });
    return {
      data: {
        code,
      },
    };
  }
}
