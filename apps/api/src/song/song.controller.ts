import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GatewayGuard } from 'src/gateway/gateway.guard';
import { SongService } from 'src/song/song.service';
import { AddSongDTO } from './dtos/addSong.dto';
import { CreatedSongDTOResponse } from 'src/song/dtos/addedSong.dto';
import { auth } from 'firebase-admin';
import { FirebaseAuthGuard } from 'src/authorization/firebase/firebase.guard';
import { PutSongDTO } from 'src/song/dtos/putSong.dto';

@ApiTags('song')
@ApiBearerAuth()
@Controller({
  path: 'sessions/:code/songs',
  version: '1',
})
export class SongController {
  constructor(@Inject(SongService) private readonly songService: SongService) {}
  @Get()
  @UseGuards(FirebaseAuthGuard)
  async getSongsHandler(@Param() sessionId: string) {
    // throw new Error('Not implemented');
    return {
      data: {
        session_id: sessionId,
        name: 'test',
      },
    };
  }

  @Post()
  @ApiOperation({
    summary: 'Add new Song',
    description: 'Add new Song to a session',
  })
  @UseGuards(GatewayGuard)
  async addSongHandler(
    @Param('code') sessionId: string,
    @Req() request: { user: auth.DecodedIdToken },
    @Body() payload: AddSongDTO,
  ): Promise<CreatedSongDTOResponse> {
    const newSong = await this.songService.addNewSong(
      sessionId,
      request.user.uid,
      payload,
    );
    return {
      data: {
        ...newSong,
      },
    };
  }

  @Put('/:songId')
  @ApiOperation({
    summary: 'do song action',
    description: 'queueUp, queueDown, top and bottom to change the queue',
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
      songId: param.songId,
    });
  }
}
