import { StreamableFile } from '@nestjs/common';
import internal from 'stream';

export interface IResourceService {
  stream: (
    videoUrl: string,
    startByte: number,
    endByte: number,
  ) => Promise<{
    chunkSize: number;
    contentLength: number;
    start: number;
    end: number;
  }>;

  getInfo: (id: string) => Promise<{
    data: {
      title: string;
      channel: string;
      url: string;
      thumbnail: string;
      formats: unknown[];
    };
  }>;
}
