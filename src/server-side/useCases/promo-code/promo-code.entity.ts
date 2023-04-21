import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Index } from 'typeorm'

import type { Tournament } from '~/server-side/useCases/tournament/tournament.entity'
import type { User } from '~/server-side/useCases/user/user.entity'

import type { Category } from '../category/category.entity'

@Entity('promo-code')
export class PromoCode {
  @PrimaryGeneratedColumn('increment', { unsigned: true })
  id: number

  @Column({ unsigned: true, nullable: false })
  tournamentId: number

  @Column({ unsigned: true, nullable: true, default: null })
  categoryId?: number

  @Column({ default: null, nullable: true })
  label?: string

  @Column({ unsigned: true, nullable: false, default: 1 })
  usageLimit?: number

  @Index('code', { unique: true })
  @Column({ length: 20, nullable: false })
  code: string

  @Column({ type: 'json', default: null, nullable: true })
  metaData?: Record<string, any>

  @Column({ nullable: true, default: true })
  actived?: boolean

  @Column({ type: 'uuid', nullable: false, length: 36 })
  createdBy: string

  @Column({ type: 'datetime', nullable: false, precision: null, default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  // relations Tournament
  @ManyToOne('Tournament', 'promoCodes', { onDelete: 'CASCADE', onUpdate: 'NO ACTION', createForeignKeyConstraints: true })
  @JoinColumn({ name: 'tournamentId', referencedColumnName: 'id' })
  tournament: Tournament

  // relations Category
  @ManyToOne('Category', 'promoCodes', { onDelete: 'CASCADE', onUpdate: 'NO ACTION', createForeignKeyConstraints: true, nullable: true })
  @JoinColumn({ name: 'categoryId', referencedColumnName: 'id' })
  category?: Category

  // relations user
  @ManyToOne('User', 'createdPromoCodes', { onDelete: 'SET NULL', onUpdate: 'SET NULL', createForeignKeyConstraints: true })
  @JoinColumn({ name: 'createdBy', referencedColumnName: 'id', foreignKeyConstraintName: 'images_createdBy_fkey' })
  createdUser?: User
}
