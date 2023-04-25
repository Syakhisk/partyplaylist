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
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GatewayGuard } from 'src/gateway/gateway.guard';
import { SongService } from 'src/song/song.service';
import { AddSongDTO } from './dtos/addSong.dto';
import { CreatedSongDTOResponse } from 'src/song/dtos/addedSong.dto';
import { auth } from 'firebase-admin';
import { FirebaseAuthGuard } from 'src/authorization/firebase/firebase.guard';
import { PutSongDTO } from 'src/song/dtos/putSong.dto';
import { SongsDetailResponseDTO } from 'src/song/dtos/songDetails.dto';
import { SwaggerMethods } from 'src/common/decorator/swagger.decorator';

@ApiTags('song')
@ApiBearerAuth()
@Controller({
  path: 'sessions/:code/songs',
  version: '1',
})
export class SongController {
  constructor(@Inject(SongService) private readonly songService: SongService) {}

  @Get()
  @SwaggerMethods({
    operation: {
      summary: 'get all songs',
      description: 'get all songs in a corresponding session',
    },
    param: { name: 'code', required: true },
    responses: [
      { status: HttpStatus.OK, type: SongsDetailResponseDTO },
      {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        description: 'user not registered',
      },
      {
        status: HttpStatus.NOT_FOUND,
        description: 'session not found',
      },
      { status: HttpStatus.UNAUTHORIZED, description: 'not having a token' },
      {
        status: HttpStatus.FORBIDDEN,
        description:
          'invalid token or (not having a/trying to access a different) session',
      },
    ],
  })
  @UseGuards(FirebaseAuthGuard)
  async getSongsHandler(
    @Param() param: { code: string },
    @Req() request: { user: auth.DecodedIdToken },
  ): Promise<SongsDetailResponseDTO> {
    const { songs } = await this.songService.getSongsBySessionCode(
      request.user.uid,
      param.code,
    );
    return {
      data: {
        songs,
      },
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @SwaggerMethods({
    operation: {
      summary: 'Add a new song',
      description: 'Add new Song to a session',
    },
    param: { name: 'code', required: true },
    body: { type: AddSongDTO },
    responses: [
      { status: HttpStatus.CREATED, type: CreatedSongDTOResponse },
      {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        description: 'user not registered',
      },
      {
        status: HttpStatus.NOT_FOUND,
        description: 'session not found',
      },
      { status: HttpStatus.UNAUTHORIZED, description: 'not having a token' },
      {
        status: HttpStatus.FORBIDDEN,
        description:
          'invalid token or (not having a/trying to access a different) session',
      },
    ],
  })
  @UseGuards(GatewayGuard)
  async addSongHandler(
    @Param('code') sessionId: string,
    @Req() request: { user: auth.DecodedIdToken },
    @Body() payload: AddSongDTO,
  ): Promise<CreatedSongDTOResponse> {
    const data = await this.songService.addNewSong(
      sessionId,
      request.user.uid,
      payload,
    );
    return {
      data,
    };
  }

  @Put('/:songId')
  @SwaggerMethods({
    operation: {
      summary: 'do song action',
      description: 'queueUp, queueDown, top and bottom to change the queue',
    },
    params: [
      { name: 'code', required: true },
      { name: 'songId', required: true },
    ],
    body: { type: PutSongDTO },
    responses: [
      {
        status: HttpStatus.OK,
        description: 'successfully changed song position',
      },
      {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        description: 'user not registered',
      },
      {
        status: HttpStatus.NOT_FOUND,
        description: 'session/songs not found ',
      },
      { status: HttpStatus.UNAUTHORIZED, description: 'not having a token' },
      {
        status: HttpStatus.FORBIDDEN,
        description:
          'invalid token or (not having a/trying to access a different) session',
      },
    ],
  })
  @UseGuards(GatewayGuard)
  async putSongHandler(
    @Param() param: { code: string; songId: string },
    @Req() request: { user: auth.DecodedIdToken },
    @Body() payload: PutSongDTO,
  ): Promise<void> {
    await this.songService.changeSong({
      action: payload.action,
      requestId: request.user.uid,
      sessionCode: param.code,
      songId: +param.songId,
    });
  }

  @Delete('/:songId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @SwaggerMethods({
    operation: {
      summary: 'delete song',
      description: 'delete song by songId',
    },
    params: [
      { name: 'code', required: true },
      { name: 'songId', required: true },
    ],
    responses: [
      { status: HttpStatus.NO_CONTENT, description: 'succeeded deletion' },
      {
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        description: 'user not registered',
      },
      {
        status: HttpStatus.NOT_FOUND,
        description: 'session/songs not found ',
      },
      { status: HttpStatus.UNAUTHORIZED, description: 'not having a token' },
      {
        status: HttpStatus.FORBIDDEN,
        description:
          'invalid token or (not having a/trying to access a different) session',
      },
    ],
  })
  @UseGuards(GatewayGuard)
  async deleteSongHandler(
    @Param() param: { code: string; songId: string },
    @Req() request: { user: auth.DecodedIdToken },
  ): Promise<void> {
    await this.songService.deleteSong(
      request.user.uid,
      param.code,
      +param.songId,
    );
  }
}
