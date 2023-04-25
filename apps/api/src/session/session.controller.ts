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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { auth } from 'firebase-admin';
import { FirebaseAuthGuard } from 'src/authorization/firebase/firebase.guard';
import { GatewayGuard } from 'src/gateway/gateway.guard';
import { CreateSessionDTO } from 'src/session/dtos/createSession.dto';
import { CreatedSessionDTOResponse } from 'src/session/dtos/createdSession.dto';
import { SessionDetailDTOResponse } from 'src/session/dtos/getSessionDetail.dto';
import { SessionService } from 'src/session/session.service';
import { SwaggerMethods } from 'src/common/decorator/swagger.decorator';
import { MySessionDTOResponse } from 'src/session/dtos/mySession.dto';

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

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @SwaggerMethods({
    operation: {
      summary: 'Create session',
      description: 'create a session as you being the host',
    },
    body: {
      type: CreateSessionDTO,
    },
    responses: [
      { status: HttpStatus.CREATED, type: CreatedSessionDTOResponse },
      {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        description:
          'user not registered or might already have/joined a session',
      },
      {
        status: HttpStatus.UNAUTHORIZED,
        description: 'not having a token',
      },
      {
        status: HttpStatus.FORBIDDEN,
        description: 'invalid token or not online',
      },
    ],
  })
  @UseGuards(GatewayGuard)
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

  @Get('/me')
  @SwaggerMethods({
    responses: [{ status: HttpStatus.BAD_REQUEST }],
  })
  @UseGuards(GatewayGuard)
  async mySession(
    @Req() request: { user: auth.DecodedIdToken },
  ): Promise<MySessionDTOResponse> {
    const session = await this.sessionService.getMySession(request.user.uid);
    return {
      data: session,
    };
  }

  @Get('/:code')
  @SwaggerMethods({
    operation: {
      summary: 'Get Session Detail',
      description: 'get session detail that user currently in',
    },
    param: {
      name: 'code',
      required: true,
    },
    responses: [
      { status: HttpStatus.OK, type: SessionDetailDTOResponse },
      {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        description: 'user not registered',
      },
      { status: HttpStatus.NOT_FOUND, description: 'session is not found' },
      {
        status: HttpStatus.FORBIDDEN,
        description: '(trying to access a different/not having) session',
      },
      {
        status: HttpStatus.UNAUTHORIZED,
        description: 'not having a token',
      },
      {
        status: HttpStatus.FORBIDDEN,
        description: 'invalid token',
      },
    ],
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
  @SwaggerMethods({
    operation: {
      summary: 'End a Session ',
      description: 'End a Session by host',
    },
    param: {
      name: 'code',
      required: true,
    },
    responses: [
      { status: HttpStatus.NO_CONTENT, description: 'success deletion' },
      {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        description: 'user not registered',
      },
      { status: HttpStatus.NOT_FOUND, description: 'session not found' },
      {
        status: HttpStatus.UNAUTHORIZED,
        description: 'not having a token',
      },
      {
        status: HttpStatus.FORBIDDEN,
        description:
          'invalid token, not online, or (not having/trying to delete another) session',
      },
    ],
  })
  @UseGuards(GatewayGuard)
  async endSessionByHostHandler(
    @Req() request: { user: auth.DecodedIdToken },
    @Param() params: { code: string },
  ) {
    await this.sessionService.endSession(request.user.uid, params.code);
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
      {
        status: HttpStatus.OK,
        description: 'Sucessfully join to a session',
      },
      { status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' },
      { status: HttpStatus.NOT_FOUND, description: 'Session not found' },
      {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        description:
          'user not registered, user already have/joined to a session',
      },
      {
        status: HttpStatus.FORBIDDEN,
        description: 'invalid token or not online',
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
