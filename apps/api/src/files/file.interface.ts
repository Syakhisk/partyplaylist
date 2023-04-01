import { FileEntity } from 'src/files/entities/files.entity';

export interface IFileRepository {
  findFileById(id: string): Promise<FileEntity>;
}
