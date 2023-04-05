import { Session } from 'src/session/entities/session.entity';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Session, (session) => session.id)
  session: Session;

  @Column()
  channel_name: string;

  @Column()
  thumbnail_url: string;

  @Column()
  video_id: string;

  @Column()
  video_title: string;

  @Column()
  video_url: string;

  @Index()
  @Column({ unique: true })
  position: number;
}
