import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Query,
  Req,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FastifyReply, FastifyRequest } from 'fastify';
import ytdl from 'ytdl-core';
import ytsr from 'ytsr';

@ApiTags('resources')
// @ApiBearerAuth()
@Controller({
  path: 'resources',
  version: '1',
})
export class ResourceController {
  @Get('/search')
  async search(@Query('q') q: string): Promise<unknown> {
    const filters = await ytsr.getFilters(q);
    const filter = filters.get('Type').get('Video');

    const searchResults = await ytsr(filter.url, { limit: 10 });
    const videoResults = searchResults.items.filter(
      (item) => item.type === 'video',
    );

    return {
      data: videoResults.map((item) => {
        const _item = item as ytsr.Video;

        return {
          id: _item.id,
          title: _item.title,
          channel: _item.author.name,
          url: _item.url,
          thumbnail: _item.bestThumbnail.url,
        };
      }),
    };
  }

  @Get(':id')
  async getStreamInfo(@Param('id') id: string): Promise<unknown> {
    const videoUrl = `https://www.youtube.com/watch?v=${id}`;
    const info = await ytdl.getInfo(videoUrl).catch((e) => {
      if (e.message.includes('Video unavailable')) {
        throw new NotFoundException(e.message);
      }

      if (e.message.includes('does not match expected format')) {
        throw new BadRequestException(e.message);
      }

      throw new InternalServerErrorException(e, e.message);
    });

    // Extract relevant video info
    const videoInfo = {
      title: info.videoDetails.title,
      channel: info.videoDetails.author.name,
      url: info.videoDetails.video_url,
      thumbnail: info.videoDetails.thumbnails[0].url,
      formats: info.formats,
    };

    // Return video info as JSON
    return {
      data: {
        ...videoInfo,
      },
    };
  }

  @Get(':id/stream')
  async getStream(
    @Param('id') id: string,
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) reply: FastifyReply,
  ): Promise<StreamableFile> {
    const headers = req.headers;
    const videoUrl = `https://www.youtube.com/watch?v=${id}`;

    const info = await ytdl.getInfo(videoUrl).catch((e) => {
      if (e.message.includes('Video unavailable')) {
        throw new NotFoundException(e.message);
      }

      if (e.message.includes('does not match expected format')) {
        throw new BadRequestException(e.message);
      }

      throw new InternalServerErrorException(e, e.message);
    });

    // Find the best available audio-only format with an mp4 container
    const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
    const audioFormat = audioFormats.find(
      (format) => format.container === 'mp4',
    );

    // Get the content length of the chosen format
    const contentLength = Number(audioFormat.contentLength);

    const range = headers.range || `bytes=0-${contentLength - 1}`;

    const [rangeStart, rangeEnd] = range.replace(/bytes=/, '').split('-');
    const start = parseInt(rangeStart, 10);
    const end = rangeEnd ? parseInt(rangeEnd, 10) : contentLength - 1;
    const chunksize = end - start + 1;

    // Create a readable stream for the requested byte range
    const audioStream = ytdl(videoUrl, {
      quality: 'highestaudio',
      filter: 'audioonly',
      range: { start, end },
    });
    // .on('data', (chunk) => {});

    // Send the appropriate headers for a partial content response
    reply.raw.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${contentLength}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'audio/mp4',
    });

    // Pipe the audio stream to the response
    return new StreamableFile(audioStream);
  }
}
