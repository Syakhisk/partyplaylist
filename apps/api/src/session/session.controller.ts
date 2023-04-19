import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
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
import { CreateSessionDTO } from 'src/session/dtos/createSession.dto';
import { CreatedSessionDTOResponse } from 'src/session/dtos/createdSession.dto';
import { SessionDetailDTOResponse } from 'src/session/dtos/getSessionDetail.dto';
import { SessionService } from 'src/session/session.service';
import { SwaggerMethods } from 'src/common/decorator/swagger.decorator';

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
  @ApiOperation({
    summary: 'Create session',
    description: 'create a session as you being the host',
  })
  @ApiBody({
    type: CreateSessionDTO,
  })
  @ApiResponse({
    type: CreatedSessionDTOResponse,
    status: HttpStatus.CREATED,
  })
  // @UseGuards(GatewayGuard)
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

  @Get('/:code')
  @ApiOperation({
    summary: 'Get Session Detail',
    description: 'get session detail that user currently in',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SessionDetailDTOResponse,
  })
  @ApiParam({
    name: 'code',
  })
  @UseGuards(FirebaseAuthGuard)
  async getSessionDetailHandler(
    @Param() param: { code: string },
    @Req() request: { user: auth.DecodedIdToken },
  ): Promise<SessionDetailDTOResponse> {
    const sessionDetail = await this.sessionService.getSessionDetail(
      request.user.uid,
      param.code,
    );

    return {
      data: sessionDetail,
    };
  }

  @Delete('/:code')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'End a Session ',
    description: 'End a Session by host',
  })
  @ApiParam({
    name: 'code',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @UseGuards(GatewayGuard)
  async endSessionByHostHandler(
    @Req() request: { user: auth.DecodedIdToken },
    @Param() params: { code: string },
  ) {
    await this.sessionService.endSession(request.user.uid, params.code);
  }

  @Get('/me')
  @SwaggerMethods({})
  @UseGuards(GatewayGuard)
  async mySession(@Req() request: { user: auth.DecodedIdToken }) {
    const session = await this.sessionService.getMySession(request.user.uid);
    return {
      data: session,
    };
  }

  @Post('/:code/join')
  @SwaggerMethods({
    operation: {
      summary: 'Join a session',
      description: 'Join logged in user to a session',
    },
    param: {
      name: 'code',
      required: true,
    },
    responses: [
      { status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' },
      { status: HttpStatus.NOT_FOUND, description: 'Session not found' },
      {
        // TODO: this should be OK than CREATED
        status: HttpStatus.CREATED,
        description: 'Sucessfully join to a session',
      },
      {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        description: 'User already joined to a session',
      },
    ],
  })
  @UseGuards(GatewayGuard)
  async joinSession(
    @Req() request: { user: auth.DecodedIdToken },
    @Param() params: { code: string },
  ) {
    await this.sessionService.joinASession(request.user.uid, params.code);
  }
}
