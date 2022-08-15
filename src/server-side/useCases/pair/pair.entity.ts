import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm'

import type { Tournament } from '~/server-side/useCases/tournament/tournament.entity'
import type { User } from '~/server-side/useCases/user/user.entity'

@Unique('pairs_key', ['tournamentId', 'userId', 'partnerId'])
@Entity('pairs')
export class Pair {
  @PrimaryGeneratedColumn('increment', { unsigned: true })
  id: number

  @Column({ unsigned: true, nullable: false })
  tournamentId: number

  @Column({ type: 'uuid', nullable: false, length: 36 })
  userId: string

  @Column({ type: 'uuid', nullable: false, length: 36 })
  partnerId: string

  @Column({ type: 'float', nullable: true, default: 0 })
  points?: number

  @Column({ type: 'float', nullable: true, default: 0 })
  weight?: number

  @Column({ unsigned: true, nullable: true, default: 0 })
  rank?: number

  @Column({ type: 'uuid', nullable: true, length: 36 })
  createdBy?: string

  @Column({ type: 'datetime', nullable: true, precision: null, default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  createdAt?: Date

  // relations
  @ManyToOne('Tournament', 'pairs', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tournamentId', referencedColumnName: 'id', foreignKeyConstraintName: 'pairs_tournamentId_fkey' })
  tournament: Tournament

  // relations user
  @ManyToOne('User', 'userPairs', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id', foreignKeyConstraintName: 'pairs_userId_fkey' })
  user: User

  @ManyToOne('User', 'partnerPairs', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'partnerId', referencedColumnName: 'id', foreignKeyConstraintName: 'pairs_partnerId_fkey' })
  partner: User

  @ManyToOne('User', 'createdPairs', { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdBy', referencedColumnName: 'id', foreignKeyConstraintName: 'pairs_createdBy_fkey' })
  createdUser?: User
}
