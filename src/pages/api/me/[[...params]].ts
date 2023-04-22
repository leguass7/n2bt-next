import { instanceToPlain } from 'class-transformer'
import { BadRequestException, createHandler, Delete, Get, HttpCode, Req } from 'next-api-decorators'

import { getRepo, prepareConnection } from '~/server-side/database/conn'
import { parseOrderDto } from '~/server-side/database/db.helper'
import { Pagination } from '~/server-side/services/PaginateService'
import type { AuthorizedPaginationApiRequest } from '~/server-side/services/PaginateService/paginate.middleware'
import type { AuthorizedApiRequest } from '~/server-side/useCases/auth/auth.dto'
import { JwtAuthGuard } from '~/server-side/useCases/auth/middleware'
import { Payment } from '~/server-side/useCases/payment/payment.entity'
import { checkPaymentService } from '~/server-side/useCases/payment/payment.service'
import { Subscription } from '~/server-side/useCases/subscriptions/subscriptions.entity'
import { User } from '~/server-side/useCases/user/user.entity'

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
    const repoPayment = ds.getRepository(Payment)

    const deleteSub = async () => repoSub.update(subscriptionId, { actived: false })
    const removePromoCode = async (paymentId: number) => {
      await repoPayment.update(paymentId, { promoCode: null })
    }

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
    if (subscription?.paymentId) await removePromoCode(subscription.paymentId)
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

    const repo = await getRepo(Subscription)
    const queryDb = repo
      .createQueryBuilder('Subscription')
      .select()
      .addSelect(['Partner.id', 'Partner.name', 'Partner.image', 'Partner.email'])
      .addSelect(['Category.id', 'Category.title', 'Category.tournamentId', 'Category.price'])
      .addSelect(['Tournament.id', 'Tournament.title', 'Tournament.maxSubscription'])
      .addSelect(['Payment.id', 'Payment.value', 'Payment.paid', 'Payment.promoCodeId'])
      .leftJoin('Subscription.partner', 'Partner')
      .innerJoin('Subscription.category', 'Category')
      .innerJoin('Subscription.payment', 'Payment')
      .innerJoin('Category.tournament', 'Tournament')
      .orderBy('Subscription.createdAt', 'DESC')
      .addOrderBy('Partner.name', 'ASC')
      .where({ userId: auth?.userId, actived: true })

    if (categoryId) queryDb.andWhere({ categoryId })

    parseOrderDto({ order, table: 'Subscription', orderFields: subsOrderFields }).querySetup(queryDb)

    const subscriptions = await queryDb.getMany()

    return { success: true, subscriptions }
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
}

export default createHandler(MeHandler)
