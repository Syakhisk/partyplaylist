import { Participant } from 'src/participant/entities/participant.entity';
import { Song } from 'src/song/entities/song.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.uid)
  @JoinColumn()
  host: User;

  @Index()
  @Column({ unique: true, nullable: false })
  code: string;

  @Column()
  name: string;

  @OneToMany(() => Participant, (participant) => participant.session, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  participants: Participant[];

  @OneToMany(() => Song, (song) => song.session, { onDelete: 'CASCADE' })
  songs: Song[];
}
