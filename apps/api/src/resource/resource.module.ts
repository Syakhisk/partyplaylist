import { Module } from '@nestjs/common';
import { ResourceController } from './resource.controller';
import { ResourceService } from './resource.service';

@Module({
  imports: [],
  providers: [ResourceService],
  controllers: [ResourceController],
})
export class ResourceModule {}
