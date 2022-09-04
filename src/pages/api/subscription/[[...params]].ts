import type { NextApiResponse } from 'next'
import { BadRequestException, createHandler, Get, HttpCode, HttpException, Patch, Post, Req, Res } from 'next-api-decorators'

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

const searchFields = ['Subscription.id', 'User.name', 'Partner.name']
const orderFields = [
  ['Subscription.id', 'id'],
  ['User.name', 'user'],
  ['Partner.name', 'partner']
]

class SubscriptionHandler {
  @Get('/download')
  @JwtAuthGuard()
  @Pagination()
  @HttpCode(200)
  async download(@Req() req: AuthorizedPaginationApiRequest, @Res() res: NextApiResponse) {
    const { query, pagination } = req

    const tournamentId = +query?.tournamentId
    if (!tournamentId) throw new BadRequestException('Torneio não informado')

    const { search, order } = pagination
    const queryText = search ? searchFields.map(field => `${field} LIKE :search`) : null

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

    if (queryText) queryDb.andWhere(`(${queryText.join(' OR ')})`, { search: `%${search}%` })
    parseOrderDto({ order, table: 'Subscription', orderFields }).querySetup(queryDb)

    const paginateService = new PaginateService('Subscription')
    const paginated = await paginateService.paginate(queryDb, req.pagination)
    return { success: true, ...paginated }
  }
}

export default createHandler(SubscriptionHandler)
