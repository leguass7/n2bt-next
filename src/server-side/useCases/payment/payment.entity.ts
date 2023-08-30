import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { transformer } from '~/server-side/database/transformer'
import type { PromoCode } from '~/server-side/useCases/promo-code/promo-code.entity'
import type { Subscription } from '~/server-side/useCases/subscriptions/subscriptions.entity'
import type { User } from '~/server-side/useCases/user/user.entity'

import { type PaymentMethod } from './payment.dto'
import type { PaymentMeta } from './payment.dto'

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('increment', { unsigned: true })
  id: number

  @Index('uuid', { unique: true })
  @Column({ type: 'uuid', nullable: true, default: null, length: 64 })
  uuid?: string

  @Column({ type: 'uuid', nullable: false, length: 36 })
  userId: string

  @Index('method')
  @Column({ nullable: false, type: 'enum', enum: ['PIX', 'CASH'] })
  method: PaymentMethod

  @Column({ type: 'decimal', scale: 2, precision: 10, nullable: true, transformer: transformer.decimal })
  value: number

  @Index('paid')
  @Column({ nullable: true, default: false })
  paid?: boolean

  @Column({ type: 'datetime', nullable: true, default: null, precision: null })
  payday?: Date

  @Column({ type: 'date', nullable: true, default: null })
  overdue?: Date

  @Column({ type: 'varchar', nullable: true, default: null, length: 36 })
  txid?: string

  @Column({ nullable: true, default: true })
  actived?: boolean

  @Column({ type: 'uuid', nullable: true, default: null, length: 36 })
  createdBy?: string

  @Column({ type: 'datetime', nullable: true, precision: null, default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date

  @Column({ type: 'varchar', nullable: true, default: null, length: 36 })
  updatedBy?: string

  @Column({ nullable: true, precision: null, onUpdate: 'CURRENT_TIMESTAMP', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt?: Date

  @Column({ type: 'json', nullable: true, default: null })
  meta?: PaymentMeta

  @Column({ nullable: true, default: null, unsigned: true })
  promoCodeId?: number

  // relations
  @OneToMany('Subscription', (subscription: Subscription) => subscription.payment)
  subscriptions?: Subscription[]

  @ManyToOne('User', 'payments', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id', foreignKeyConstraintName: 'payments_userId_fkey' })
  user: User

  @ManyToOne('User', 'createdPayments', { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdBy', referencedColumnName: 'id', foreignKeyConstraintName: 'payments_createdBy_fkey' })
  userCreated?: User

  @ManyToOne('User', 'updatedPayments', { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'updatedBy', referencedColumnName: 'id', foreignKeyConstraintName: 'payments_updatedBy_fkey' })
  userUpdated?: User

  @ManyToOne('PromoCode', 'payments', { onDelete: 'RESTRICT', onUpdate: 'RESTRICT', nullable: true })
  @JoinColumn({ name: 'promoCodeId', referencedColumnName: 'id', foreignKeyConstraintName: 'payments_promoCodeId_fkey' })
  promoCode?: PromoCode
}
