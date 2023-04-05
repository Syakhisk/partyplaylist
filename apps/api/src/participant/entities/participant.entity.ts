import { Session } from 'src/session/entities/session.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Participant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Session, (session) => session.id)
  session: Session;

  @ManyToOne(() => User, (user) => user.uid)
  user: User;
}
