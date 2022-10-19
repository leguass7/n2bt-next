import type { NextApiResponse } from 'next'
import { BadRequestException, createHandler, ForbiddenException, Get, HttpCode, HttpException, Patch, Post, Req, Res } from 'next-api-decorators'

import { prepareConnection } from '~/server-side/database/conn'
import { parseOrderDto } from '~/server-side/database/db.helper'
import { PaginateService, Pagination } from '~/server-side/services/PaginateService'
import type { AuthorizedPaginationApiRequest } from '~/server-side/services/PaginateService/paginate.middleware'
import { factoryXlsxService } from '~/server-side/services/XlsxService'
import type { AuthorizedApiRequest } from '~/server-side/useCases/auth/auth.dto'
import { JwtAuthGuard, IfAuth } from '~/server-side/useCases/auth/middleware'
import { subscriptionToSheetDto } from '~/server-side/useCases/subscriptions/subscription.helper'
import { IRequestSubscriptionTransfer } from '~/server-side/useCases/subscriptions/subscriptions.dto'
import { Subscription } from '~/server-side/useCases/subscriptions/subscriptions.entity'

const userSearchFields = ['id', 'name', 'email', 'cpf', 'phone', 'nick']
const searchFields = ['Subscription.id', 'User.name', 'Partner.name']
const orderFields = [
  ['Subscription.id', 'id'],
  ['User.name', 'user', 'name'],
  ['Partner.name', 'partner']
]

class SubscriptionHandler {
  @Get('/download')
  @JwtAuthGuard()
  @Pagination()
  @HttpCode(200)
  async download(@Req() req: AuthorizedPaginationApiRequest, @Res() res: NextApiResponse) {
    const { query } = req

    const tournamentId = +query?.tournamentId
    if (!tournamentId) throw new BadRequestException('Torneio não informado')

    // const { search } = pagination
    // const queryText = search ? searchFields.map(field => `${field} LIKE :search`) : null

    const ds = await prepareConnection()
    const repo = ds.getRepository(Subscription)

    const queryDb = repo
      .createQueryBuilder('Subscription')
      .select()
      .addSelect(['Category.id', 'Category.title'])
      .addSelect(['User.id', 'User.name', 'User.image', 'User.email', 'User.nick', 'User.gender', 'User.completed', 'User.phone', 'User.shirtSize'])
      .addSelect(['Partner.id', 'Partner.name', 'Partner.image', 'Partner.email', 'Partner.nick', 'Partner.gender', 'Partner.completed'])
      .innerJoin('Subscription.category', 'Category')
      .innerJoin('Subscription.user', 'User')
      .innerJoin('Subscription.partner', 'Partner')
      .where({ actived: true })
      .andWhere('Category.tournamentId = :tournamentId', { tournamentId })

    queryDb.addOrderBy('Category.title', 'ASC')
    queryDb.addOrderBy('User.name', 'ASC')
    // if (queryText) queryDb.andWhere(`(${queryText.join(' OR ')})`, { search: `%${search}%` })
    // parseOrderDto({ order, table: 'Subscription', orderFields }).querySetup(queryDb)
    const subscriptions = await queryDb.getMany()

    const sheet = factoryXlsxService()
    const data = subscriptions.map(subscriptionToSheetDto)
    if (!data?.length) throw new BadRequestException('Arquivo vazio')

    const result = await sheet.createDownloadResource('xlsx', data)

    const stream = typeof result.resource === 'string' ? Buffer.from(result.resource, result.encode) : result.resource

    res.writeHead(200, {
      'Content-Type': result.mimeType,
      'Content-Length': stream.length
    })
    return res.end(stream)
  }

  @Get('/list')
  @JwtAuthGuard()
  @Pagination()
  @HttpCode(200)
  async list(@Req() req: AuthorizedPaginationApiRequest) {
    const { query, pagination } = req

    const categoryId = +query?.categoryId
    if (!categoryId) throw new BadRequestException('Categoria não encontrada')

    const { search, order } = pagination
    const queryText = search ? searchFields.map(field => `${field} LIKE :search`) : null

    const ds = await prepareConnection()
    const repo = ds.getRepository(Subscription)

    const queryDb = repo
      .createQueryBuilder('Subscription')
      .select()
      .addSelect(['Category.id', 'Category.title'])
      .addSelect(['User.id', 'User.name', 'User.image', 'User.email', 'User.nick', 'User.gender', 'User.completed'])
      .addSelect(['Partner.id', 'Partner.name', 'Partner.image', 'Partner.email', 'Partner.nick', 'Partner.gender', 'Partner.completed'])
      .innerJoin('Subscription.category', 'Category')
      .innerJoin('Subscription.user', 'User')
      .innerJoin('Subscription.partner', 'Partner')
      .where({ categoryId, actived: true })

    if (queryText) queryDb.andWhere(`(${queryText.join(' OR ')})`, { search: `%${search}%` })
    parseOrderDto({ order, table: 'Subscription', orderFields }).querySetup(queryDb)

    const subscriptions = await queryDb.getMany()

    return { success: true, subscriptions }
  }

  @Get('/list/:categoryId')
  @JwtAuthGuard()
  @Pagination()
  @HttpCode(200)
  async listByCategory(@Req() req: AuthorizedPaginationApiRequest) {
    const { query, pagination } = req

    const categoryId = +query?.categoryId
    if (!categoryId) throw new BadRequestException('Categoria não encontrada')

    const { order } = pagination

    const ds = await prepareConnection()
    const repo = ds.getRepository(Subscription)

    const queryDb = repo
      .createQueryBuilder('Subscription')
      .select()
      .addSelect(['User.id', 'User.name', 'User.image', 'User.email', 'User.nick', 'User.gender'])
      .addSelect(['Partner.id', 'Partner.name', 'Partner.image', 'Partner.email', 'Partner.nick', 'Partner.gender'])
      .innerJoin('Subscription.user', 'User')
      .innerJoin('Subscription.partner', 'Partner')
      .where({ categoryId, actived: true })

    parseOrderDto({ order, table: 'Subscription', orderFields }).querySetup(queryDb)

    const subscriptions = await queryDb.getMany()

    return { success: true, subscriptions }
  }

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

  @Get('/search')
  @IfAuth()
  @HttpCode(200)
  async search(@Req() req: AuthorizedApiRequest) {
    const { query } = req
    const categoryId = +query?.categoryId
    if (!categoryId) throw new BadRequestException('Categoria inválida')

    const search = `${query?.search}`
    if (!search) return { success: true, users: [] }

    const ds = await prepareConnection()
    const repo = ds.getRepository(Subscription)

    const userFields = userSearchFields.map(u => `User.${u}`)
    const queryText = search ? [...userFields.map(field => `${field} LIKE :search`)] : null

    const queryDb = repo
      .createQueryBuilder('Subscription')
      .select(['Subscription.id', 'Subscription.categoryId'])
      .addSelect(userFields)
      .addSelect(['Category.id', 'Category.tournamentId', 'Category.title'])
      .innerJoin('Subscription.category', 'Category')
      .innerJoin('Subscription.user', 'User')
      .where({ actived: true })
      .andWhere('Subscription.categoryId = :categoryId', { categoryId })
      .limit(10)

    queryDb.andWhere(`(${queryText.join(' OR ')})`, { search: `%${search}%` })

    const subscriptions = await queryDb.getMany()
    const users = subscriptions.map(({ user }) => {
      return user
    })

    return { success: true, users }
  }

  @Patch('/:subscriptionId')
  @JwtAuthGuard()
  @HttpCode(200)
  async update(@Req() req: AuthorizedApiRequest) {
    const { auth, query, body } = req
    const subscriptionId = +query?.params[0] || 0
    if (!subscriptionId) throw new BadRequestException()

    const ds = await prepareConnection()
    const repo = ds.getRepository(Subscription)
    const subscription = await repo.update(subscriptionId, { ...body, updatedAt: new Date(), updatedBy: auth.userId })
    if (!subscription) throw new BadRequestException()

    return { success: true, subscriptionId, affected: subscription?.affected }
  }

  @Post('/pair')
  @JwtAuthGuard()
  @HttpCode(201)
  async createPair(@Req() req: AuthorizedApiRequest<Partial<Subscription>>) {
    const { body, auth } = req
    const currentUserId = auth?.userId
    if (!currentUserId) throw new BadRequestException('Usuário não encontrado')

    const ds = await prepareConnection()
    const repo = ds.getRepository(Subscription)

    const { categoryId, partnerId, value, paid, userId } = body
    const saveData: Partial<Subscription> = { actived: true, paid: !!paid, categoryId, value, createdBy: currentUserId }

    const subscriptions = (
      await Promise.all(
        [repo.create({ ...saveData, userId, partnerId }), repo.create({ ...saveData, userId: partnerId, partnerId: userId })].map(async u =>
          repo.save(u)
        )
      )
    ).filter(f => !!f)

    if (subscriptions?.length < 2) throw new HttpException(500, 'erro na criação da inscrição')

    return { success: true, subscriptions }
  }

  @Post()
  @JwtAuthGuard()
  @HttpCode(201)
  async create(@Req() req: AuthorizedApiRequest<Partial<Subscription>>) {
    const { body, auth } = req
    const currentUserId = auth?.userId
    const isAdmin = !!(auth?.level >= 8)
    if (!currentUserId) throw new BadRequestException('Usuário não encontrado')

    const ds = await prepareConnection()
    const repo = ds.getRepository(Subscription)

    const { categoryId, partnerId, value, paid, userId } = body

    const newSubscription: Partial<Subscription> = {
      actived: true,
      paid: isAdmin ? !!paid : false,
      categoryId,
      partnerId,
      userId: isAdmin ? userId : currentUserId,
      value
    }

    const hasSubscription = await repo.findOne({ where: { categoryId, userId: isAdmin ? userId : currentUserId, actived: true } })
    if (hasSubscription) {
      await repo.update(hasSubscription.id, { actived: false, updatedBy: currentUserId })
    }

    const data = repo.create(newSubscription)
    const subscription = await repo.save(data)
    if (!subscription) throw new HttpException(500, 'erro na criação da inscrição')

    return { success: true, subscriptionId: subscription?.id, subscription }
  }

  @Get('/report')
  @IfAuth()
  async report(@Req() req: AuthorizedPaginationApiRequest) {
    const { auth, query } = req

    const isAdmin = !!(auth?.level >= 8)
    if (!isAdmin) throw new ForbiddenException()

    const tournamentId = +query?.tournamentId
    if (!tournamentId) throw new BadRequestException('Torneio não encontrado')

    const search = query?.search

    const ds = await prepareConnection()
    const repo = ds.getRepository(Subscription)

    const repoQuery = repo
      .createQueryBuilder('Subscription')
      .select(['Subscription.id', 'Subscription.categoryId', 'Subscription.userId', 'Subscription.paid', 'Subscription.shirtDelivered'])
      .innerJoin('Subscription.category', 'Category')
      .innerJoin('Subscription.user', 'User')
      .addSelect(['Category.id', 'Category.tournamentId'])
      .addSelect(['User.id', 'User.name', 'User.gender', 'User.nick', 'User.shirtSize', 'User.email', 'User.phone'])
      .where({ actived: true })
      .distinct()
      .andWhere('Category.tournamentId = :tournamentId', { tournamentId })
      .orderBy('User.name', 'ASC')
      .groupBy('Subscription.userId')

    if (search)
      repoQuery.andWhere(`( User.name LIKE :search OR User.nick LIKE :search OR User.email LIKE :search OR User.phone LIKE :search )`, {
        search: `%${search}%`
      })

    const subscriptions = await repoQuery.getMany()

    const statistics: any = { total: subscriptions.length }

    statistics.sizes = subscriptions.reduce((ac, at) => {
      const size = at.user.shirtSize

      if (Object.hasOwn(ac, size)) ac[size] += 1
      else ac[size] = 1

      return ac
    }, {})

    return { success: true, subscriptions, statistics }
  }

  @Get()
  @HttpCode(200)
  @Pagination()
  async paginate(@Req() req: AuthorizedPaginationApiRequest) {
    const { query } = req
    const ds = await prepareConnection()
    const repo = ds.getRepository(Subscription)

    const categoryId = +query?.categoryId
    if (!categoryId) throw new BadRequestException('categoria inválida')

    const onlyConfirmed = ['1', 'true'].includes(query?.onlyConfirmed) ? true : false

    const { search, order } = req.pagination
    const queryText = search ? searchFields.map(field => `${field} LIKE :search`) : null

    const queryDb = repo
      .createQueryBuilder('Subscription')
      .select()
      .addSelect(['Category.id', 'Category.title'])
      .addSelect(['User.id', 'User.name', 'User.image', 'User.email', 'User.nick', 'User.gender', 'User.completed'])
      .addSelect(['Partner.id', 'Partner.name', 'Partner.image', 'Partner.email', 'Partner.nick', 'Partner.gender', 'Partner.completed'])
      .innerJoin('Subscription.category', 'Category')
      .innerJoin('Subscription.user', 'User')
      .innerJoin('Subscription.partner', 'Partner')
      .where({ categoryId, actived: true })

    if (onlyConfirmed) queryDb.andWhere(`Subscription.verified IS NOT NULL`)

    if (queryText) queryDb.andWhere(`(${queryText.join(' OR ')})`, { search: `%${search}%` })
    parseOrderDto({ order, table: 'Subscription', orderFields }).querySetup(queryDb)

    const paginateService = new PaginateService('Subscription')
    const paginated = await paginateService.paginate(queryDb, req.pagination)
    return { success: true, ...paginated }
  }
}

export default createHandler(SubscriptionHandler)
