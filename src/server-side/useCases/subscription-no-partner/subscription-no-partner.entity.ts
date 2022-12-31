import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

import { transformer } from '~/server-side/database/transformer'
import type { Category } from '~/server-side/useCases/category/category.entity'
import type { Payment } from '~/server-side/useCases/payment/payment.entity'
import type { User } from '~/server-side/useCases/user/user.entity'

@Entity('subscriptions_no_partner')
export class SubscriptionNoPartner {
  // @PrimaryGeneratedColumn('increment', { unsigned: true })
  @Column({ primary: true, generated: 'increment' })
  id: number

  @Column({ unsigned: true })
  categoryId: number

  @Column({ type: 'uuid', length: 36 })
  userId: string

  // @Column({ type: 'uuid', nullable: true, default: null })
  // partnerId?: string

  @Column({ type: 'decimal', scale: 2, precision: 10, nullable: true, transformer: transformer.decimal })
  value: number

  @Column({ nullable: true, default: true })
  actived?: boolean

  @Column({ nullable: true, default: false })
  paid?: boolean

  @Column({ unsigned: true, nullable: true, default: null })
  paymentId?: number

  @Column('datetime', { nullable: true, default: null })
  shirtDelivered?: Date

  @Column({ type: 'uuid', nullable: true, default: null, length: 36 })
  createdBy?: string

  @Column({ type: 'datetime', nullable: true, precision: null, default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date

  @Column({ type: 'uuid', nullable: true, default: null, length: 36 })
  updatedBy?: string

  @Column({ nullable: true, precision: null, onUpdate: 'CURRENT_TIMESTAMP', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt?: Date

  // relations
  @ManyToOne('User', 'userSubscriptions_no_partner', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id', foreignKeyConstraintName: 'subscriptions_no_partner_userId_fkey' })
  user: User

  // @ManyToOne('User', 'partnerSubscriptions_no_partner', { onDelete: 'SET NULL' })
  // @JoinColumn({ name: 'partnerId', referencedColumnName: 'id', foreignKeyConstraintName: 'subscriptions_no_partner_partnerId_fkey' })
  // partner?: User

  @Column({ type: 'datetime', precision: null, nullable: true, default: null })
  verified?: Date

  @ManyToOne('User', 'createdSubscriptions_no_partner', { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdBy', referencedColumnName: 'id', foreignKeyConstraintName: 'subscriptions_no_partner_createdBy_fkey' })
  createdUser?: User

  @ManyToOne('User', 'updatedSubscriptions_no_partner', { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'updatedBy', referencedColumnName: 'id', foreignKeyConstraintName: 'subscriptions_no_partner_updatedBy_fkey' })
  updatedUser?: User

  // relations categories
  @ManyToOne('Category', 'subscriptions_no_partner', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'categoryId', referencedColumnName: 'id', foreignKeyConstraintName: 'subscriptions_no_partner_categoryId_fkey' })
  category: Category

  // relations payment
  @ManyToOne('Payment', 'subscriptions_no_partner', { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'paymentId', referencedColumnName: 'id', foreignKeyConstraintName: 'subscriptions_no_partner_paymentId_fkey' })
  payment?: Payment
}
