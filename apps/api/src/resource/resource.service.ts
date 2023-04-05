import ytdl from 'ytdl-core';
import { Injectable } from '@nestjs/common';
import { IResourceService } from './resource.interface';

// TODO: Not working
@Injectable()
export class ResourceService implements IResourceService {
  constructor() {}

  async stream(videoUrl: string, startByte: number = 0, endByte: number) {
    const info = await this.getInfo(videoUrl);
    if (!info) return;

    // Find the best available audio-only format with an mp4 container
    const audioFormats = ytdl.filterFormats(info.data.formats, 'audioonly');
    const audioFormat = audioFormats.find(
      (format) => format.container === 'mp4',
    );

    // Get the content length of the chosen format
    const contentLength = Number(audioFormat.contentLength);

    // const range = headers.range || `bytes=0-${contentLength - 1}`;
    const start = startByte;
    const end = endByte ?? contentLength - 1;
    const chunkSize = end - start + 1;
    console.log({ videoUrl, startByte, endByte, start, end, chunkSize });

    return {
      contentLength,
      chunkSize,
      start,
      end,
    };
  }

  async getInfo(videoUrl: string) {
    // .getInfo(`https://www.youtube.com/watch?v=${id}`)
    const info = await ytdl.getInfo(videoUrl).catch((e) => {
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
}
