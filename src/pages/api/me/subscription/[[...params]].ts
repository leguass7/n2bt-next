import { createHandler, Get, HttpCode, Req } from '@storyofams/next-api-decorators'

import { prepareConnection } from '~/server-side/database/conn'
import { parseOrderDto } from '~/server-side/database/db.helper'
import { Pagination } from '~/server-side/services/PaginateService'
import type { AuthorizedPaginationApiRequest } from '~/server-side/services/PaginateService/paginate.middleware'
import { JwtAuthGuard } from '~/server-side/useCases/auth/middleware'
import { Subscription } from '~/server-side/useCases/subscriptions/subscriptions.entity'

// const searchFields = ['id', 'title']
const orderFields = [
  ['Subscription.id', 'id'],
  ['Category.title', 'category'],
  ['Tournament.title', 'tournament']
]

class MeSubscriptionsHandler {
  @Get()
  @JwtAuthGuard()
  @Pagination()
  @HttpCode(200)
  async list(@Req() req: AuthorizedPaginationApiRequest) {
    const { query, auth } = req
    const { order } = req?.pagination

    const categoryId = +query?.categoryId || 0
    const ds = await prepareConnection()
    const repo = ds.getRepository(Subscription)

    const queryDb = repo
      .createQueryBuilder('Subscription')
      .select()
      .addSelect(['Partner.id', 'Partner.name', 'Partner.image', 'Partner.email'])
      .addSelect(['Category.id', 'Category.title'])
      .addSelect(['Tournament.id', 'Tournament.title'])
      .innerJoin('Subscription.partner', 'Partner')
      .innerJoin('Subscription.category', 'Category')
      .innerJoin('Category.tournament', 'Tournament')
      .orderBy('Subscription.createdAt', 'DESC')
      .addOrderBy('Partner.name', 'ASC')
      .where({ userId: auth?.userId })

    if (categoryId) queryDb.andWhere({ categoryId })

    parseOrderDto({ order, table: 'Subscription', orderFields }).querySetup(queryDb)

    const subscriptions = await queryDb.getMany()

    return { success: true, subscriptions }
  }
}

export default createHandler(MeSubscriptionsHandler)
