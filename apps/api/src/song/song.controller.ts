import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GatewayGuard } from 'src/gateway/gateway.guard';
import { SongService } from 'src/song/song.service';
import { AddSongDTO } from './dtos/addSong.dto';

@ApiTags('song')
@ApiBearerAuth()
@Controller({
  path: 'sessions/:session_id/songs',
  version: '1',
})
export class SongController {
  @Get()
  @UseGuards(GatewayGuard)
  async getSongsHandler(@Param('session_id') sessionId: string) {
    // throw new Error('Not implemented');
    return {
      data: {
        session_id: sessionId,
        name: 'test',
      },
    };
  }

  @Post()
  async addSongHandler(
    @Param('session_id') sessionId: string,
    @Body() payload: AddSongDTO,
  ) {
    // throw new Error('Not implemented');
    return {
      data: {
        session_id: sessionId,
        name: 'test',
      },
    };
  }
}
