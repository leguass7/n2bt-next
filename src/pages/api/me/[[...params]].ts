import { BadRequestException, createHandler, Get, HttpCode, Patch, Req } from '@storyofams/next-api-decorators'
import { instanceToPlain } from 'class-transformer'

import { prepareConnection } from '~/server-side/database/conn'
import { parseOrderDto } from '~/server-side/database/db.helper'
import { Pagination } from '~/server-side/services/PaginateService'
import type { AuthorizedPaginationApiRequest } from '~/server-side/services/PaginateService/paginate.middleware'
import type { AuthorizedApiRequest } from '~/server-side/useCases/auth/auth.dto'
import { JwtAuthGuard } from '~/server-side/useCases/auth/middleware'
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

    const queryDb = repo
      .createQueryBuilder('Subscription')
      .select()
      .addSelect(['Partner.id', 'Partner.name', 'Partner.image', 'Partner.email'])
      .addSelect(['Category.id', 'Category.title', 'Category.tournamentId'])
      .addSelect(['Tournament.id', 'Tournament.title'])
      .innerJoin('Subscription.partner', 'Partner')
      .innerJoin('Subscription.category', 'Category')
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
