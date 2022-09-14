import { BadRequestException, createHandler, Get, HttpCode, Req } from 'next-api-decorators'

import { prepareConnection } from '~/server-side/database/conn'
import { Pagination } from '~/server-side/services/PaginateService'
import type { AuthorizedPaginationApiRequest } from '~/server-side/services/PaginateService/paginate.middleware'
import { JwtAuthGuard } from '~/server-side/useCases/auth/middleware'
import { checkinRawDto, searchFields } from '~/server-side/useCases/checkin/checkin.helper'
import { Subscription } from '~/server-side/useCases/subscriptions/subscriptions.entity'

const orderFields = [
  ['Subscription.id', 'id'],
  ['User.name', 'user', 'name'],
  ['Partner.name', 'partner']
]

class CheckinHandler {
  @Get('/list')
  @JwtAuthGuard()
  @Pagination()
  @HttpCode(200)
  async paginate(@Req() req: AuthorizedPaginationApiRequest) {
    const { query, pagination } = req

    const tournamentId = +query?.tournamentId
    if (!tournamentId) throw new BadRequestException('Torneio inválido')
    const { search, order } = pagination

    const ds = await prepareConnection()
    const repo = ds.getRepository(Subscription)

    const queryText = search ? [...searchFields.map(field => `${field} LIKE :search`)] : null
    const findText = queryText ? `AND (${queryText.map(f => f.replace(':search', `%${search}%`)).join(' OR ')})` : ''

    const checkins = (await repo.query(`
    SELECT DISTINCT(Subscription.userId) AS Subscription_userId, Subscription.categoryId AS Subscription_categoryId,
      Subscription.actived AS Subscription_actived, Subscription.verified AS Subscription_verified,
      Category.id AS Category_id, Category.tournamentId AS Category_tournamentId, Category.title AS Category_title,
      Category.gender AS Category_gender,
      User.id AS User_id, User.name AS User_name, User.nick AS User_nick, User.email AS User_email, User.image AS User_image,
      User.gender AS User_gender, User.completed AS User_completed,
      Checkin.id AS Checkin_id, Checkin.userId AS Checkin_userId, Checkin.check AS Checkin_check, Checkin.createdAt AS Checkin_createdAt
      FROM subscriptions Subscription
      INNER JOIN categories Category ON Category.id = Subscription.categoryId
      INNER JOIN users User ON User.id = Subscription.userId
      LEFT OUTER JOIN checkin Checkin ON User.id = Checkin.userId AND Checkin.tournamentId = ${tournamentId}
      WHERE Subscription.actived = '1' AND Category.tournamentId = ${tournamentId} AND Category.published = '1'
      ${findText}
      ORDER BY User.name ASC;
    `)) as any[]

    return { success: true, data: checkins.map(d => checkinRawDto(d)), total: checkins?.length, page: 1, size: 1000 }
  }
}

export default createHandler(CheckinHandler)
