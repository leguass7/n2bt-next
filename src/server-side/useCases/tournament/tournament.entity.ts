import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import type { Arena } from '~/server-side/useCases/arena/arena.entity'
import { Category } from '~/server-side/useCases/category/category.entity'
import { Pair } from '~/server-side/useCases/pair/pair.entity'
import { Ranking } from '~/server-side/useCases/ranking/ranking.entity'
import type { User } from '~/server-side/useCases/user/user.entity'

import { Checkin } from '../checkin/checkin.entity'

@Entity('tournaments')
export class Tournament {
  @PrimaryGeneratedColumn('increment', { unsigned: true })
  id: number

  @Column({ unsigned: true, nullable: false })
  arenaId: number

  @Column()
  title: string

  @Column({ type: 'longtext', nullable: true })
  description?: string

  @Column({ nullable: true, default: false })
  published: boolean

  @Column({ type: 'datetime', nullable: true, precision: null })
  expires: Date

  @Column({ nullable: true, default: 200 })
  limitUsers?: number

  @Column({ nullable: true, default: 2 })
  maxSubscription?: number

  @Column({ type: 'text', nullable: true })
  download?: string

  @Column({ type: 'uuid', nullable: true, length: 36 })
  createdBy?: string

  @Column({ type: 'datetime', nullable: true, precision: null, default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date

  @Column({ type: 'uuid', nullable: true, length: 36 })
  updatedBy?: string

  @Column({ nullable: true, precision: null, onUpdate: 'CURRENT_TIMESTAMP', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt?: Date

  @Column({ type: 'datetime', nullable: true, precision: null })
  subscriptionStart: Date

  @Column({ type: 'datetime', nullable: true, precision: null })
  subscriptionEnd: Date

  // relations
  @OneToMany(() => Category, category => category.tournament)
  categories?: Category[]

  @OneToMany(() => Ranking, ranking => ranking.tournament)
  rankings?: Ranking[]

  @OneToMany(() => Pair, pair => pair.tournament)
  pairs?: Pair[]

  @ManyToOne('Arena', 'tournaments', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'arenaId', referencedColumnName: 'id', foreignKeyConstraintName: 'tournaments_arenaId_fkey' })
  arena: Arena

  // relations user
  @ManyToOne('User', 'createdTournaments', { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdBy', referencedColumnName: 'id', foreignKeyConstraintName: 'tournaments_createdBy_fkey' })
  createdUser?: User

  @ManyToOne('User', 'updatedTournaments', { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'updatedBy', referencedColumnName: 'id', foreignKeyConstraintName: 'tournaments_updatedBy_fkey' })
  updatedUser?: User

  @OneToMany(() => Checkin, checkins => checkins.tournament)
  checkins?: Checkin[]
}
