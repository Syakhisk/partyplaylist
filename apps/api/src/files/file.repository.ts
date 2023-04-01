import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from 'src/files/entities/files.entity';
import { IFileRepository } from 'src/files/file.interface';
import { Repository } from 'typeorm';

@Injectable()
export class FileRepository implements IFileRepository {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}
  async findFileById(id: string | null): Promise<FileEntity> {
    if (!id) return null;

    const existingFile = await this.fileRepository.findOne({ where: { id } });
    if (!existingFile) {
      throw new HttpException('file doesnt exists', HttpStatus.BAD_REQUEST);
    }
    return existingFile;
  }
}
