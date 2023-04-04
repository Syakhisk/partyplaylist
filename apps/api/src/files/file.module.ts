import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from 'src/files/entities/files.entity';
import { FileRepository } from 'src/files/file.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  providers: [FileRepository],
  exports: [FileRepository],
})
export class FileModule {}
