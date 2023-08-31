import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import type { Arena } from '~/server-side/useCases/arena/arena.entity'
import type { Category } from '~/server-side/useCases/category/category.entity'
import type { Checkin } from '~/server-side/useCases/checkin/checkin.entity'
import type { Image } from '~/server-side/useCases/image/image.entity'
import type { Pair } from '~/server-side/useCases/pair/pair.entity'
import type { PromoCode } from '~/server-side/useCases/promo-code/promo-code.entity'
import type { Ranking } from '~/server-side/useCases/ranking/ranking.entity'
import type { User } from '~/server-side/useCases/user/user.entity'

import { TournamentModality } from './tournament.dto'

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

  @Column({ type: 'enum', enum: Object.values(TournamentModality), default: TournamentModality.BEACH_TENNIS })
  modality?: keyof typeof TournamentModality

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

  @Column({ type: 'datetime', nullable: true, precision: null })
  creditCardEnd?: Date

  // relations
  @OneToMany('Category', (category: Category) => category.tournament)
  categories?: Category[]

  @OneToMany('Ranking', (ranking: Ranking) => ranking.tournament)
  rankings?: Ranking[]

  @OneToMany('Pair', (pair: Pair) => pair.tournament)
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

  @OneToMany('Checkin', (checkins: Checkin) => checkins.tournament)
  checkins?: Checkin[]

  // relations Images
  @OneToMany('Image', (images: Image) => images.createdUser)
  createdImages?: Image[]

  // relations PromoCode
  @OneToMany('PromoCode', (promoCode: PromoCode) => promoCode.tournament)
  promoCodes?: PromoCode[]
}
