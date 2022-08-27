import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { transformer } from '~/server-side/database/transformer'
import type { Category } from '~/server-side/useCases/category/category.entity'
import type { Payment } from '~/server-side/useCases/payment/payment.entity'
import type { User } from '~/server-side/useCases/user/user.entity'

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('increment', { unsigned: true })
  id: string

  @Column({ unsigned: true })
  categoryId: number

  @Column({ type: 'uuid', length: 36 })
  userId: string

  @Column({ type: 'uuid', nullable: true, default: null })
  partnerId?: string

  @Column({ type: 'decimal', scale: 2, precision: 10, nullable: true, transformer: transformer.decimal })
  value: number

  @Column({ nullable: true, default: true })
  actived?: boolean

  @Column({ nullable: true, default: false })
  paid?: boolean

  @Column({ unsigned: true, nullable: true, default: null })
  paymentId?: string

  @Column({ type: 'uuid', nullable: true, default: null, length: 36 })
  createdBy?: string

  @Column({ type: 'datetime', nullable: true, precision: null, default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date

  @Column({ type: 'uuid', nullable: true, default: null, length: 36 })
  updatedBy?: string

  @Column({ nullable: true, precision: null, onUpdate: 'CURRENT_TIMESTAMP', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt?: Date

  // relations

  @ManyToOne('User', 'userSubscriptions', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id', foreignKeyConstraintName: 'subscriptions_userId_fkey' })
  user: User

  @ManyToOne('User', 'partnerSubscriptions', { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'partnerId', referencedColumnName: 'id', foreignKeyConstraintName: 'subscriptions_partnerId_fkey' })
  partner?: User

  @ManyToOne('User', 'createdSubscriptions', { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdBy', referencedColumnName: 'id', foreignKeyConstraintName: 'subscriptions_createdBy_fkey' })
  createdUser?: User

  @ManyToOne('User', 'updatedSubscriptions', { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'updatedBy', referencedColumnName: 'id', foreignKeyConstraintName: 'subscriptions_updatedBy_fkey' })
  updatedUser?: User

  // relations categories
  @ManyToOne('Category', 'subscriptions', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'categoryId', referencedColumnName: 'id', foreignKeyConstraintName: 'subscriptions_categoryId_fkey' })
  category: Category

  // relations payment
  @ManyToOne('Payment', 'subscriptions', { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'paymentId', referencedColumnName: 'id', foreignKeyConstraintName: 'subscriptions_paymentId_fkey' })
  payment?: Payment
}
