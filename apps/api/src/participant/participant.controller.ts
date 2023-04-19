import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Body,
  Param,
  Get,
  Delete,
  HttpException,
  Inject,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { auth } from 'firebase-admin';
import { FirebaseAuthGuard } from 'src/authorization/firebase/firebase.guard';
import { GatewayGuard } from 'src/gateway/gateway.guard';
import { ParticipantService } from 'src/participant/participant.service';
import { ParticipantsDTOResponse } from 'src/participant/dtos/getParticipants.dto';
import { JoinSessionDTO } from 'src/session/dtos/joinSession.dto';
import { SwaggerMethods } from 'src/common/decorator/swagger.decorator';

@ApiTags('participants')
@ApiBearerAuth()
@Controller({
  path: 'session/:code/participants',
  version: '1',
})
export class ParticipantController {
  constructor(
    @Inject(ParticipantService)
    private readonly participantService: ParticipantService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all participant',
    description: 'get all participant that belong to a session',
  })
  @ApiParam({
    name: 'code',
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

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Join to a session',
    description: 'user join to a session',
  })
  @ApiBody({
    type: JoinSessionDTO,
  })
  @ApiParam({
    name: 'code',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
  })
  @UseGuards(GatewayGuard)
  async postParticipantByCodeHandler(
    @Req() request: { user: auth.DecodedIdToken },
    @Body() payload: JoinSessionDTO,
    @Param() params: { code: string },
  ) {
    ParticipantController.validatePost(request.user.uid, payload.userId);
    await this.participantService.joinASession(request.user.uid, params.code);
  }

  @Delete('/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Kick or Leave Session',
    description:
      'a host can kick its participant or participant can leave the session',
  })
  @ApiParam({
    name: 'code',
  })
  @ApiParam({
    name: 'userId',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @UseGuards(GatewayGuard)
  async endSessionByUserIdHandler(
    @Req() request: { user: auth.DecodedIdToken },
    @Param() params: { code: string; userId: string },
  ) {
    await this.participantService.kickByHostOrLeaveSession({
      code: params.code,
      requestUID: request.user.uid,
      userId: params.userId,
    });
  }

  private static validatePost(requestUid: string, payloadUid: string) {
    if (requestUid !== payloadUid)
      throw new HttpException(
        { message: 'user not the same' },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
  }
}
