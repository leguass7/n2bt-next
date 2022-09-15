import { BadRequestException, createHandler, Get, HttpCode, Patch, Req } from 'next-api-decorators'
import type { DeepPartial } from 'typeorm'

import { prepareConnection } from '~/server-side/database/conn'
import { parseOrderDto } from '~/server-side/database/db.helper'
import { Pagination } from '~/server-side/services/PaginateService'
import type { AuthorizedPaginationApiRequest } from '~/server-side/services/PaginateService/paginate.middleware'
import type { AuthorizedApiRequest } from '~/server-side/useCases/auth/auth.dto'
import { JwtAuthGuard } from '~/server-side/useCases/auth/middleware'
import { Checkin } from '~/server-side/useCases/checkin/checkin.entity'
import { checkinRawDto, searchFields } from '~/server-side/useCases/checkin/checkin.helper'
import { Subscription } from '~/server-side/useCases/subscriptions/subscriptions.entity'

const orderFields = [
  ['User.id', 'id', 'userId'],
  ['User.name', 'user', 'name'],
  ['User.phone', 'phone'],
  ['Checkin.createdAt', 'createdAt', 'date'],
  ['Checkin.check', 'active', 'check']
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
    const findText = queryText ? `AND (${queryText.map(f => f.replace(':search', `'%${search}%'`)).join(' OR ')})` : ''

    const orderText = parseOrderDto({ order, orderFields }).toString()

    const checkins = (await repo.query(`
    SELECT DISTINCT(Subscription.userId) AS Subscription_userId,
      Subscription.actived AS Subscription_actived,
      Category.tournamentId AS Category_tournamentId,
      User.id AS User_id, User.name AS User_name, User.nick AS User_nick, User.email AS User_email, User.image AS User_image,
      User.gender AS User_gender, User.completed AS User_completed,
      Checkin.id AS Checkin_id, Checkin.userId AS Checkin_userId, Checkin.check AS Checkin_check, Checkin.createdAt AS Checkin_createdAt
      FROM subscriptions Subscription
      INNER JOIN categories Category ON Category.id = Subscription.categoryId AND Category.published = '1'
      INNER JOIN users User ON User.id = Subscription.userId
      LEFT OUTER JOIN checkin Checkin ON User.id = Checkin.userId AND Checkin.tournamentId = ${tournamentId}
      WHERE Subscription.actived = '1' AND Category.tournamentId = ${tournamentId} AND Category.published = '1'
      ${findText}
      GROUP BY Subscription_userId, Category_tournamentId, User_id
      ORDER BY ${orderText}, User.name ASC;
    `)) as any[]

    return { success: true, data: checkins.map(d => checkinRawDto(d)), total: checkins?.length, page: 1, size: 1000 }
  }

  @Patch('/store')
  @JwtAuthGuard()
  @HttpCode(200)
  async store(@Req() req: AuthorizedApiRequest<DeepPartial<Checkin>>) {
    const { auth, body } = req
    const tournamentId = body?.tournamentId
    const userId = body?.userId

    const ds = await prepareConnection()
    const repo = ds.getRepository(Checkin)

    const hasCheckin = await repo.findOne({ where: { tournamentId, userId } })
    if (hasCheckin) {
      const updated = await repo.update(hasCheckin.id, { ...body, createdBy: auth.userId })
      if (!updated) throw new BadRequestException('Erro ao atualizar')
      return { success: true, checkinId: hasCheckin?.id, checkin: hasCheckin, affected: updated?.affected }
    }

    const save = repo.create({ ...body, createdBy: auth.userId })
    const created = await repo.save(save)
    if (!created) throw new BadRequestException('Erro ao criar')
    return { success: true, checkinId: created.id, checkin: created }
  }
}

export default createHandler(CheckinHandler)
