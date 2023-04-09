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
  song_id: string;

  @Column()
  song_title: string;

  @Column()
  song_url: string;

  @Index()
  @Column({ unique: true })
  position: number;
}
