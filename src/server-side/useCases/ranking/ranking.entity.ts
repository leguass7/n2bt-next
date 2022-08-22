import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm'

import type { Tournament } from '~/server-side/useCases/tournament/tournament.entity'
import type { User } from '~/server-side/useCases/user/user.entity'

@Unique('rankings_tournamentId_userId_key', ['tournamentId', 'userId'])
@Entity('rankings')
export class Ranking {
  @PrimaryGeneratedColumn('increment', { unsigned: true })
  id: number

  @Column({ unsigned: true, nullable: false })
  tournamentId: number

  @Column({ type: 'uuid', nullable: false, length: 36 })
  userId: string

  @Column({ type: 'float' })
  points: number

  @Column({ type: 'uuid', nullable: true, length: 36 })
  createdBy?: string

  @Column({ type: 'datetime', nullable: true, precision: null, default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date

  @Column({ type: 'uuid', nullable: true, length: 36 })
  updatedBy?: string

  @Column({ nullable: true, precision: null, onUpdate: 'CURRENT_TIMESTAMP', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt?: Date

  // relations
  @ManyToOne('Tournament', 'rankings', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tournamentId', referencedColumnName: 'id', foreignKeyConstraintName: 'rankings_tournamentId_fkey' })
  tournament: Tournament

  // relations user
  @ManyToOne('User', 'rankings', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id', foreignKeyConstraintName: 'rankings_userId_fkey' })
  user: User

  @ManyToOne('User', 'createdRankings', { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdBy', referencedColumnName: 'id', foreignKeyConstraintName: 'rankings_createdBy_fkey' })
  createdUser?: User

  @ManyToOne('User', 'updatedRankings', { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'updatedBy', referencedColumnName: 'id', foreignKeyConstraintName: 'rankings_updatedBy_fkey' })
  updatedUser?: User
}