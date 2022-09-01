import { BadRequestException, createHandler, Get, HttpCode, HttpException, Post, Req } from 'next-api-decorators'

import { prepareConnection } from '~/server-side/database/conn'
import { parseOrderDto } from '~/server-side/database/db.helper'
import { PaginateService, Pagination } from '~/server-side/services/PaginateService'
import type { AuthorizedPaginationApiRequest } from '~/server-side/services/PaginateService/paginate.middleware'
import type { AuthorizedApiRequest } from '~/server-side/useCases/auth/auth.dto'
import { JwtAuthGuard, IfAuth } from '~/server-side/useCases/auth/middleware'
import { IRequestSubscriptionTransfer } from '~/server-side/useCases/subscriptions/subscriptions.dto'
import { Subscription } from '~/server-side/useCases/subscriptions/subscriptions.entity'

const searchFields = ['id', 'title']
const orderFields = [
  ['Subscription.id', 'id'],
  ['Subscription.title', 'title'],
  ['User.name', 'user']
]

class SubscriptionHandler {
  @Post('/transfer')
  @JwtAuthGuard()
  @HttpCode(200)
  async transfer(@Req() req: AuthorizedApiRequest<IRequestSubscriptionTransfer>) {
    const { query, body, auth } = req
    const tournamentId = +query?.tournamentId
    if (!tournamentId) throw new BadRequestException('Torneio não encontrado')

    const toCategory = body?.to || []
    if (!toCategory?.length) throw new BadRequestException('Lista de transferência inválida')

    const ds = await prepareConnection()
    const repo = ds.getRepository(Subscription)

    const result = Promise.all(
      toCategory.map(async ({ categoryId, subscriptionId, userId }) => {
        return repo
          .createQueryBuilder('Subscription')
          .where('id = :subscriptionId', { subscriptionId })
          .andWhere('userId = :userId', { userId })
          .update({ categoryId, updatedBy: auth.userId, updatedAt: new Date() })
          .execute()
      })
    )

    return { success: true, data: result }
  }

  @Get('/summary')
  @IfAuth()
  @HttpCode(200)
  async summary(@Req() req: AuthorizedApiRequest) {
    const tournamentId = +req?.query?.tournamentId
    if (!tournamentId) throw new BadRequestException('not_found_tournamentId')

    const ds = await prepareConnection()
    const repo = ds.getRepository(Subscription)

    const total = await repo
      .createQueryBuilder('Subscription')
      .select(['Subscription.id', 'Subscription.categoryId'])
      .addSelect(['Category.id', 'Category.tournamentId'])
      .innerJoin('Subscription.category', 'Category')
      .where({ actived: true })
      .andWhere('Category.tournamentId = :tournamentId', { tournamentId })
      .getCount()
    return { success: true, total }
  }

  @Post()
  @JwtAuthGuard()
  @HttpCode(201)
  async create(@Req() req: AuthorizedApiRequest<Partial<Subscription>>) {
    const { body, auth } = req
    const userId = auth?.userId
    if (!userId) throw new BadRequestException('Usuário não encontrado')

    const ds = await prepareConnection()
    const repo = ds.getRepository(Subscription)

    const { categoryId, partnerId, value } = body
    const newSubscription: Partial<Subscription> = {
      actived: true,
      paid: false,
      createdBy: userId,
      updatedBy: userId,
      categoryId,
      partnerId,
      value,
      userId
    }
    const hasSubscription = await repo.findOne({ where: { categoryId, userId, actived: true } })
    if (hasSubscription) {
      await repo.update(hasSubscription.id, { actived: false, updatedBy: userId })
    }

    const data = repo.create(newSubscription)
    const subscription = await repo.save(data)
    if (!subscription) throw new HttpException(500, 'erro na criação da inscrição')

    return { success: true, subscriptionId: subscription?.id, subscription }
  }

  @Get()
  @HttpCode(200)
  @Pagination()
  async paginate(@Req() req: AuthorizedPaginationApiRequest) {
    const ds = await prepareConnection()
    const repo = ds.getRepository(Subscription)

    const categoryId = +req?.query?.categoryId
    if (!categoryId) throw new BadRequestException('not_found_categoryId')

    const { search, order } = req.pagination
    const queryText = search ? searchFields.map(field => `Subscription.${field} LIKE :search`) : null

    const queryDb = repo
      .createQueryBuilder('Subscription')
      .select()
      .addSelect(['Category.id', 'Category.title'])
      .addSelect(['User.id', 'User.name', 'User.image', 'User.email', 'User.nick', 'User.gender'])
      .addSelect(['Partner.id', 'Partner.name', 'Partner.image', 'Partner.email', 'Partner.nick', 'Partner.gender'])
      .innerJoin('Subscription.category', 'Category')
      .innerJoin('Subscription.user', 'User')
      .innerJoin('Subscription.partner', 'Partner')
      .where({ categoryId })

    if (queryText) queryDb.andWhere(`(${queryText.join(' OR ')})`, { search: `%${search}%` })
    parseOrderDto({ order, table: 'Subscription', orderFields }).querySetup(queryDb)

    const paginateService = new PaginateService('Subscription')
    const paginated = await paginateService.paginate(queryDb, req.pagination)
    return { success: true, ...paginated }
  }
}

export default createHandler(SubscriptionHandler)
