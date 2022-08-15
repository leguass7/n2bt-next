import { Account } from '~/server-side/useCases/account/account.entity'
import { Arena } from '~/server-side/useCases/arena/arena.entity'
import { Category } from '~/server-side/useCases/category/category.entity'
import { Config } from '~/server-side/useCases/config/config.entity'
import { Payment } from '~/server-side/useCases/payment/payment.entity'
import { Session } from '~/server-side/useCases/session/session.entity'
import { Subscription } from '~/server-side/useCases/subscriptions/subscriptions.entity'
import { Tournament } from '~/server-side/useCases/tournaments/tournaments.entity'
import { User } from '~/server-side/useCases/user/user.entity'
import { VerificationToken } from '~/server-side/useCases/verification-token/verification-token.entity'

export const entities = [User, Session, Account, VerificationToken, Arena, Tournament, Category, Payment, Subscription, Config]
