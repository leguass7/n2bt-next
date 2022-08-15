import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm'

// import { transformer } from '~/server-side/database/transformer'
import type { User } from '~/server-side/useCases/user/user.entity'

@Unique('sessions_sessionToken_key', ['sessionToken'])
@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  sessionToken: string

  @Column({ type: 'uuid' })
  userId: string

  @Column()
  expires: Date

  @ManyToOne('User', 'sessions', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id', foreignKeyConstraintName: 'sessions_userId_fkey' })
  user: User
}
