import { Session } from 'src/session/entities/session.entity';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['position'], { deferrable: 'INITIALLY DEFERRED' })
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
  song_id: string;

  @Column()
  song_title: string;

  @Column()
  song_url: string;

  @Index()
  @Column()
  position: number;
}
