import { Exclude } from 'class-transformer'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { Account } from '~/server-side/useCases/account/account.entity'
import { Appointment } from '~/server-side/useCases/appointment/appointment.entity'
import { Arena } from '~/server-side/useCases/arena/arena.entity'
import { Category } from '~/server-side/useCases/category/category.entity'
import { Checkin } from '~/server-side/useCases/checkin/checkin.entity'
import { Config } from '~/server-side/useCases/config/config.entity'
import { Image } from '~/server-side/useCases/image/image.entity'
import { Pair } from '~/server-side/useCases/pair/pair.entity'
import { Payment } from '~/server-side/useCases/payment/payment.entity'
import { PlayField } from '~/server-side/useCases/play-field/play-field.entity'
import { PromoCode } from '~/server-side/useCases/promo-code/promo-code.entity'
import { Ranking } from '~/server-side/useCases/ranking/ranking.entity'
import { Session } from '~/server-side/useCases/session/session.entity'
import { Subscription } from '~/server-side/useCases/subscriptions/subscriptions.entity'
import { Tournament } from '~/server-side/useCases/tournament/tournament.entity'

import { UserGender } from './user.dto'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: false })
  name: string

  @Column({ nullable: true, default: null })
  nick?: string

  @Column({ nullable: false, unique: true })
  email: string

  @Column({ type: 'datetime', precision: null, nullable: true, default: null })
  emailVerified?: Date

  @Column({ type: 'varchar', nullable: true })
  image?: string | null

  @Exclude()
  @Column({ type: 'varchar', length: 191, nullable: true })
  password?: string | null

  @Column({ type: 'varchar', length: 20, nullable: true })
  cpf?: string | null

  @Column({ type: 'enum', enum: ['F', 'M'], nullable: false, default: 'M' })
  gender?: UserGender

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string | null

  @Column({ type: 'date', nullable: true })
  birday?: Date | string | null

  @Column({ default: null })
  allowedContact?: boolean

  @Column({ nullable: true, default: false })
  completed?: boolean

  @Column({ nullable: true, default: true })
  actived?: boolean

  @Column({ type: 'varchar', length: 5, nullable: true })
  category?: string

  @Column({ type: 'varchar', length: 5, nullable: true, default: 'M' })
  shirtSize?: string

  @Column({ nullable: true, default: 1 })
  level?: number

  @Column({ nullable: true })
  reset?: string

  @Column({ nullable: true, type: 'datetime', precision: null, default: null })
  lastAcess?: Date

  // relations sigin
  @OneToMany(() => Session, session => session.user)
  sessions?: Session[]

  @OneToMany(() => Account, account => account.user)
  accounts?: Account[]

  // relations subscriptions
  @OneToMany(() => Subscription, subscription => subscription.user)
  userSubscriptions?: Subscription[]

  @OneToMany(() => Subscription, subscription => subscription.partner)
  partnerSubscriptions?: Subscription[]

  @OneToMany(() => Subscription, subscription => subscription.createdUser)
  createdSubscriptions?: Subscription[]

  @OneToMany(() => Subscription, subscription => subscription.updatedUser)
  updatedSubscriptions?: Subscription[]

  // relations payment

  @OneToMany(() => Payment, payment => payment.user)
  payments?: Payment[]

  @OneToMany(() => Payment, payment => payment.userCreated)
  createdPayments?: Payment[]

  @OneToMany(() => Payment, payment => payment.userUpdated)
  updatedPayments?: Payment[]

  // relations Tournaments
  @OneToMany(() => Tournament, tournament => tournament.createdUser)
  createdTournaments?: Tournament[]

  @OneToMany(() => Tournament, tournament => tournament.updatedUser)
  updatedTournaments?: Tournament[]

  // relations rankings
  @OneToMany(() => Ranking, ranking => ranking.user)
  rankings?: Ranking[]

  @OneToMany(() => Ranking, ranking => ranking.createdUser)
  createdRankings?: Ranking[]

  @OneToMany(() => Ranking, ranking => ranking.updatedUser)
  updatedRankings?: Ranking[]

  // relations pairs
  @OneToMany(() => Pair, pair => pair.user)
  userPairs?: Pair[]

  @OneToMany(() => Pair, pair => pair.partner)
  partnerPairs?: Pair[]

  @OneToMany(() => Pair, pair => pair.createdUser)
  createdPairs?: Pair[]

  // relations Categories
  @OneToMany(() => Category, category => category.createdUser)
  createdCategories?: Category[]

  @OneToMany(() => Category, category => category.updatedUser)
  updatedCategories?: Category[]

  // relations Arenas
  @OneToMany(() => Arena, arena => arena.user)
  arenas?: Arena[]

  @OneToMany(() => Arena, arena => arena.createdUser)
  createdArenas?: Arena[]

  @OneToMany(() => Arena, arena => arena.updatedUser)
  updatedArenas?: Arena[]

  // relations Configs
  @OneToMany(() => Config, config => config.user)
  configs?: Config[]

  // relations checkin
  @OneToMany(() => Checkin, checkins => checkins.tournament)
  checkins?: Checkin[]

  // relations Images
  @OneToMany(() => Image, images => images.createdUser)
  createdImages?: Image[]

  // relations play fields
  @OneToMany(() => PlayField, field => field.createdBy)
  createdPlayFields?: PlayField[]

  @OneToMany(() => PlayField, field => field.updatedBy)
  updatedPlayFields?: PlayField[]

  // relations appointments
  @OneToMany(() => Appointment, appointment => appointment.userId)
  appointments?: Appointment[]

  @OneToMany(() => Appointment, appointment => appointment.createdBy)
  createdAppointments?: Appointment[]

  @OneToMany(() => Appointment, appointment => appointment.updatedBy)
  updatedAppointments?: Appointment[]

  @OneToMany(() => PromoCode, promoCode => promoCode.createdUser)
  createdPromoCodes?: PromoCode[]
}
