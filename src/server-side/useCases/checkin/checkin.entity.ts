import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne, Unique } from 'typeorm'

import type { Tournament } from '~/server-side/useCases/tournament/tournament.entity'
import type { User } from '~/server-side/useCases/user/user.entity'

@Unique('unique_checkin', ['tournamentId', 'userId'])
@Entity('checkin')
export class Checkin {
  @PrimaryGeneratedColumn('increment', { unsigned: true })
  id: string

  @Column({ unsigned: true, nullable: false })
  tournamentId: number

  @Column({ type: 'uuid', nullable: false, length: 36 })
  userId: string

  @Column({ nullable: true, default: false })
  check?: boolean

  @Column({ type: 'uuid', nullable: true, length: 36 })
  createdBy?: string

  @Column({ type: 'datetime', nullable: true, precision: null, default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  createdAt?: Date

  // relations
  @ManyToOne('Tournament', 'checkins', { onDelete: 'CASCADE', onUpdate: 'NO ACTION' })
  @JoinColumn({ name: 'tournamentId', referencedColumnName: 'id', foreignKeyConstraintName: 'checkin_tournamentId_fkey' })
  tournament?: Tournament

  @ManyToOne('User', 'checkins', { onDelete: 'CASCADE', onUpdate: 'NO ACTION' })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id', foreignKeyConstraintName: 'checkin_userId_fkey' })
  user?: User
}
