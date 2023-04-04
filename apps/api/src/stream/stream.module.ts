import { Module } from '@nestjs/common';
import { StreamController } from './stream.controller';

@Module({
  imports: [],
  providers: [],
  controllers: [StreamController],
})
export class StreamModule {}
