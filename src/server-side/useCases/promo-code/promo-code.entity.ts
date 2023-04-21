import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Index } from 'typeorm'

import type { Category } from '~/server-side/useCases/category/category.entity'
import type { Tournament } from '~/server-side/useCases/tournament/tournament.entity'
import type { User } from '~/server-side/useCases/user/user.entity'

@Entity('promo_code')
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

  @Column({ type: 'uuid', nullable: true, length: 36, default: null })
  updatedBy?: string

  @Column({ type: 'datetime', nullable: true, precision: null, default: null })
  updatedAt?: Date

  // relations Tournament
  @ManyToOne('Tournament', 'promoCodes', { onDelete: 'CASCADE', onUpdate: 'NO ACTION', createForeignKeyConstraints: true })
  @JoinColumn({ name: 'tournamentId', referencedColumnName: 'id', foreignKeyConstraintName: 'promo_tournamentId_fkey' })
  tournament: Tournament

  // relations Category
  @ManyToOne('Category', 'promoCodes', { onDelete: 'CASCADE', onUpdate: 'NO ACTION', createForeignKeyConstraints: true, nullable: true })
  @JoinColumn({ name: 'categoryId', referencedColumnName: 'id', foreignKeyConstraintName: 'promo_categoryId_fkey' })
  category?: Category

  // relations user
  @ManyToOne('User', 'createdPromoCodes', { onDelete: 'CASCADE', onUpdate: 'NO ACTION', createForeignKeyConstraints: true, nullable: false })
  @JoinColumn({ name: 'createdBy', referencedColumnName: 'id', foreignKeyConstraintName: 'promo_code_createdBy_fkey' })
  createdUser: User
}
