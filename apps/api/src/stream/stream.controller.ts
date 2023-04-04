import {
  Controller,
  Get,
  Param,
  Req,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FastifyReply, FastifyRequest } from 'fastify';
import ytdl from 'ytdl-core';

@ApiTags('users')
// @ApiBearerAuth()
@Controller({
  path: 'stream',
  version: '1',
})
export class StreamController {
  constructor() {}

  @Get(':id')
  async getStream(
    @Param('id') id: string,
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) reply: FastifyReply,
  ): Promise<StreamableFile> {
    const headers = req.headers;
    const videoUrl = `https://www.youtube.com/watch?v=${id}`;
    const info = await ytdl.getInfo(videoUrl);

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

  @Get(':id/info')
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
    };

    // Return video info as JSON
    return {
      data: {
        ...videoInfo,
      },
    };
  }
}
