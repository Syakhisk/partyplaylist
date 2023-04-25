import {
  Controller,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Param,
  Get,
  Delete,
  Inject,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { auth } from 'firebase-admin';
import { FirebaseAuthGuard } from 'src/authorization/firebase/firebase.guard';
import { GatewayGuard } from 'src/gateway/gateway.guard';
import { ParticipantService } from 'src/participant/participant.service';
import { ParticipantsDTOResponse } from 'src/participant/dtos/getParticipants.dto';
import { SwaggerMethods } from 'src/common/decorator/swagger.decorator';

@ApiTags('participants')
@ApiBearerAuth()
@Controller({
  path: 'sessions/:code/participants',
  version: '1',
})
export class ParticipantController {
  constructor(
    @Inject(ParticipantService)
    private readonly participantService: ParticipantService,
  ) {}

  @Get('/')
  @SwaggerMethods({
    operation: {
      summary: 'Get all participant',
      description: 'get all participant that belong to a session',
    },
    param: {
      name: 'code',
      required: true,
    },
    responses: [
      { status: HttpStatus.OK, type: ParticipantsDTOResponse },
      {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        description: 'user not registered',
      },
      {
        status: HttpStatus.NOT_FOUND,
        description: 'session is not found',
      },
      {
        status: HttpStatus.FORBIDDEN,
        description:
          'invalid token or (not having a / trying to access a different) session',
      },
      {
        status: HttpStatus.UNAUTHORIZED,
        description: 'not having a token',
      },
    ],
  })
  @UseGuards(FirebaseAuthGuard)
  async getAllParticipant(
    @Req() request: { user: auth.DecodedIdToken },
    @Param() params: { code: string },
  ): Promise<ParticipantsDTOResponse> {
    const { participants } =
      await this.participantService.getParticipantsBySessionCode(
        request.user.uid,
        params.code,
      );
    return {
      data: {
        participants,
      },
    };
  }

  @Delete('/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @SwaggerMethods({
    operation: {
      summary: 'Kick or Leave Session',
      description:
        'a host can kick its participant or participant can leave the session',
    },
    params: [
      { name: 'code', required: true },
      { name: 'userId', required: true },
    ],
    responses: [
      { status: HttpStatus.NO_CONTENT, description: 'succeeded deletion' },
      {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        description:
          'user not registered, or participant user (not in the /doesnt have a) session',
      },
      {
        status: HttpStatus.UNAUTHORIZED,
        description: 'not having a token',
      },
      {
        status: HttpStatus.FORBIDDEN,
        description:
          'invalid token, not online, or (not having a / trying to access a different) session',
      },
    ],
  })
  @UseGuards(GatewayGuard)
  async endSessionByUserIdHandler(
    @Req() request: { user: auth.DecodedIdToken },
    @Param() params: { code: string; userId: string },
  ): Promise<void> {
    await this.participantService.kickByHostOrLeaveSession({
      code: params.code,
      requestUID: request.user.uid,
      userId: params.userId,
    });
  }
}
