import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
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
    const info = await ytdl
      .getInfo(`https://www.youtube.com/watch?v=${id}`)
      .catch((e) => {
        console.log(e);
        return null;
      });

    if (!info) return;

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

  // TODO: 404
  @Get(':id/stream')
  @ApiResponse({
    status: 206,
    description: 'The video stream',
  })
  async getStream(
    @Param('id') id: string,
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) reply: FastifyReply,
  ): Promise<StreamableFile> {
    const headers = req.headers;
    const videoUrl = `https://www.youtube.com/watch?v=${id}`;

    const info = await ytdl.getInfo(videoUrl).catch((e) => {
      console.error(e);
      return null;
    });

    if (!info) return null;

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
