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
import { User } from '~/server-side/useCases/user/user.entity'
import { VerificationToken } from '~/server-side/useCases/verification-token/verification-token.entity'

export const entities = [
  User,
  Session,
  Account,
  VerificationToken,
  Arena,
  Tournament,
  Category,
  Payment,
  Ranking,
  Pair,
  Subscription,
  Config,
  Checkin,
  Image,
  PlayField,
  Appointment,
  PromoCode
]
