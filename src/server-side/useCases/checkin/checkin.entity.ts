import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm'

import type { Tournament } from '../tournament/tournament.entity'
import type { User } from '../user/user.entity'

@Entity('checkin')
export class Checkin {
  @PrimaryGeneratedColumn('increment', { unsigned: true })
  id: string

  @Column({ unsigned: true, nullable: true, default: null })
  tournamentId?: number

  @Column({ type: 'uuid', nullable: true, length: 36, default: null })
  userId: string

  @Column({ nullable: true, default: false })
  check: boolean

  @Column({ type: 'uuid', nullable: true, length: 36 })
  createdBy?: string

  @Column({ type: 'datetime', nullable: true, precision: null, default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  createdAt?: Date

  // relations
  @ManyToOne('Tournament', 'checkins')
  @JoinColumn({ name: 'tournamentId', referencedColumnName: 'id', foreignKeyConstraintName: 'checkin_tournamentId_fkey' })
  tournament?: Tournament

  @ManyToOne('User', 'checkins')
  @JoinColumn({ name: 'userId', referencedColumnName: 'id', foreignKeyConstraintName: 'checkin_userId_fkey' })
  user?: User
}
