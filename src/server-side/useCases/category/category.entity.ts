import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { Ranking } from '~/server-side/useCases/ranking/ranking.entity'
import { Subscription } from '~/server-side/useCases/subscriptions/subscriptions.entity'
import type { Tournament } from '~/server-side/useCases/tournament/tournament.entity'
import type { User } from '~/server-side/useCases/user/user.entity'

export type CategoryGender = 'M' | 'F' | 'MF'

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('increment', { unsigned: true })
  id: number

  @Column({ unsigned: true, nullable: false })
  tournamentId: number

  @Column({ nullable: false })
  title: string

  @Column({ type: 'longtext', nullable: true, default: null })
  description?: string

  @Column({ nullable: true, default: false })
  published: boolean

  @Column({ nullable: true, default: false })
  mixGender?: boolean

  @Column({ type: 'decimal', scale: 2, precision: 10, nullable: true, default: null })
  price: number

  @Column({ nullable: true, default: 50, type: 'float' })
  discount?: number

  @Column({ type: 'uuid', nullable: true, length: 36, default: null })
  createdBy?: string

  @Column({ type: 'datetime', nullable: true, precision: null, default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date

  @Column({ type: 'uuid', nullable: true, length: 36 })
  updatedBy?: string

  @Column({ nullable: true, precision: null, onUpdate: 'CURRENT_TIMESTAMP', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt?: Date

  // relations
  @ManyToOne('Tournament', 'categories', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tournamentId', referencedColumnName: 'id', foreignKeyConstraintName: 'categories_tournamentId_fkey' })
  tournament: Tournament

  @OneToMany(() => Subscription, subscription => subscription.category)
  subscriptions: Subscription[]

  @OneToMany(() => Ranking, ranking => ranking.category)
  rankings: Ranking[]

  // relations user
  @ManyToOne('User', 'createdCategories', { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdBy', referencedColumnName: 'id', foreignKeyConstraintName: 'categories_createdBy_fkey' })
  createdUser?: User

  @ManyToOne('User', 'updatedCategories', { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'updatedBy', referencedColumnName: 'id', foreignKeyConstraintName: 'categories_updatedBy_fkey' })
  updatedUser?: User
}
