import { instanceToPlain } from 'class-transformer'
import { BadRequestException, createHandler, Delete, Get, HttpCode, Req } from 'next-api-decorators'

import { prepareConnection } from '~/server-side/database/conn'
import { parseOrderDto } from '~/server-side/database/db.helper'
import { Pagination } from '~/server-side/services/PaginateService'
import type { AuthorizedPaginationApiRequest } from '~/server-side/services/PaginateService/paginate.middleware'
import type { AuthorizedApiRequest } from '~/server-side/useCases/auth/auth.dto'
import { JwtAuthGuard } from '~/server-side/useCases/auth/middleware'
import { checkPaymentService } from '~/server-side/useCases/payment/payment.service'
import { SubscriptionNoPartner } from '~/server-side/useCases/subscription-no-partner/subscription-no-partner.entity'
import { Subscription } from '~/server-side/useCases/subscriptions/subscriptions.entity'
import { User } from '~/server-side/useCases/user/user.entity'

// const searchFields = ['id', 'name', 'email', 'cpf', 'phone', 'nick']
// const otherSearch = ['Category.title']
// const orderFields = [
//   ['User.id', 'id'],
//   ['User.name', 'name'],
//   ['User.nick', 'nick']
// ]

// const searchFields = ['id', 'title']
const subsOrderFields = [
  ['Subscription.id', 'id'],
  ['Category.title', 'category'],
  ['Tournament.title', 'tournament']
]

class MeHandler {
  @Delete('/subscription/:subscriptionId')
  @JwtAuthGuard()
  @HttpCode(200)
  async deleteSub(@Req() req: AuthorizedPaginationApiRequest) {
    const { query, auth } = req
    const subscriptionId = +query?.params[1] || 0
    const userId = auth?.userId
    if (!subscriptionId) throw new BadRequestException('Inscrição inválida')
    if (!userId) throw new BadRequestException('Usuário inválida')

    const ds = await prepareConnection()
    const repoSub = ds.getRepository(Subscription)

    const deleteSub = async () => repoSub.update(subscriptionId, { actived: false })

    const subscription = await repoSub.findOne({ where: { id: subscriptionId, userId }, relations: { payment: true } })
    if (!subscription) throw new BadRequestException('Inscrição não encontrada')
    if (!!subscription?.paid) throw new BadRequestException('Inscrição já está paga')

    if (!!subscription?.payment) {
      if (!!subscription?.payment?.paid) {
        await repoSub.update(subscriptionId, { paid: true })
        throw new BadRequestException('Pagamento já foi realizado')
      } else {
        const check = await checkPaymentService(ds, { userId, paymentId: subscription?.payment?.id, disableqrcode: true })
        if (!check?.success) throw new BadRequestException(`${check?.message || 'Erro ao verificar pagamento'}`)
        if (!!check?.paid) throw new BadRequestException('Pagamento já foi realizado')
      }
    }

    await deleteSub()
    return { success: true, subscriptionId }
  }

  @Get('/subscription')
  @JwtAuthGuard()
  @Pagination()
  @HttpCode(200)
  async list(@Req() req: AuthorizedPaginationApiRequest) {
    const { query, auth } = req
    const { order } = req?.pagination

    const categoryId = +query?.categoryId || 0
    const ds = await prepareConnection()
    const repo = ds.getRepository(Subscription)
    const noPartnerRepo = ds.getRepository(SubscriptionNoPartner)

    const noPartnerQueryDb = noPartnerRepo
      .createQueryBuilder('SubscriptionNoPartner')
      .select()
      .addSelect(['Category.id', 'Category.title', 'Category.tournamentId', 'Category.price'])
      .addSelect(['Tournament.id', 'Tournament.title', 'Tournament.maxSubscription'])
      .innerJoin('SubscriptionNoPartner.category', 'Category')
      .innerJoin('Category.tournament', 'Tournament')
      .orderBy('SubscriptionNoPartner.createdAt', 'DESC')
      .where({ userId: auth?.userId, actived: true })

    const queryDb = repo
      .createQueryBuilder('Subscription')
      .select()
      .addSelect(['Partner.id', 'Partner.name', 'Partner.image', 'Partner.email'])
      .addSelect(['Category.id', 'Category.title', 'Category.tournamentId', 'Category.price'])
      .addSelect(['Tournament.id', 'Tournament.title', 'Tournament.maxSubscription'])
      .innerJoin('Subscription.partner', 'Partner')
      .innerJoin('Subscription.category', 'Category')
      .innerJoin('Category.tournament', 'Tournament')
      .orderBy('Subscription.createdAt', 'DESC')
      .addOrderBy('Partner.name', 'ASC')
      .where({ userId: auth?.userId, actived: true })

    if (categoryId) {
      queryDb.andWhere({ categoryId })
      noPartnerQueryDb.andWhere({ categoryId })
    }

    parseOrderDto({ order, table: 'Subscription', orderFields: subsOrderFields }).querySetup(queryDb)

    const subscriptions = await queryDb.getMany()
    const subscriptionsNoPartner = await noPartnerQueryDb.getMany()

    return { success: true, subscriptions: subscriptions.concat(subscriptionsNoPartner) }
  }

  @Get('/')
  @HttpCode(200)
  @JwtAuthGuard()
  async me(@Req() req: AuthorizedApiRequest) {
    const { auth } = req
    const ds = await prepareConnection()
    const repo = ds.getRepository(User)
    const user = await repo.findOne({ where: { id: auth.userId } })
    if (!user) throw new BadRequestException()

    return { success: true, user: instanceToPlain(user) }
  }

  // @Patch()
  // @JwtAuthGuard()
  // @HttpCode(201)
  // async saveMe(@Req() req: AuthorizedApiRequest<IUser>) {
  //   const { auth } = req
  //   const ds = await prepareConnection()
  //   const repo = ds.getRepository(User)
  //   const userId = auth?.userId
  //   const { birday, ...data } = req?.body

  //   const u: Partial<IUser> = { ...data }
  //   if (birday) u.birday = parseISO(`${birday}`)

  //   if (!userId) throw new BadRequestException('Usuário não encontrado')
  //   const user = await repo.update(userId, u)

  //   return { success: !!user, userId }
  // }

  // @Get('/me')
  // @JwtAuthGuard()
  // @HttpCode(200)
  // async me(@Req() req: AuthorizedApiRequest) {
  //   const { auth } = req
  //   const userId = auth?.userId

  //   const ds = await prepareConnection()
  //   const repo = ds.getRepository(User)
  //   const user = await repo.findOne({ where: { id: userId } })
  //   if (!user) throw new BadRequestException()

  //   return { success: true, user: instanceToPlain(user) }
  // }
}

export default createHandler(MeHandler)
