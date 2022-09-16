import { BadRequestException, createHandler, Delete, Get, HttpCode, Patch, Post, Req } from 'next-api-decorators'
import type { FindOptionsWhere } from 'typeorm'

import { prepareConnection } from '~/server-side/database/conn'
import { parseOrderDto } from '~/server-side/database/db.helper'
import { PaginateService, Pagination } from '~/server-side/services/PaginateService'
import type { AuthorizedPaginationApiRequest } from '~/server-side/services/PaginateService/paginate.middleware'
import type { AuthorizedApiRequest } from '~/server-side/useCases/auth/auth.dto'
import { IfAuth, JwtAuthGuard } from '~/server-side/useCases/auth/middleware'
import type { ICategory } from '~/server-side/useCases/category/category.dto'
import { Category } from '~/server-side/useCases/category/category.entity'
import { User } from '~/server-side/useCases/user/user.entity'

const searchFields = ['id', 'title']
const orderFields = [
  ['Category.id', 'id'],
  ['Category.title', 'title']
]

class CategoryHandler {
  @Get('/list-sub')
  @IfAuth()
  @Pagination()
  @HttpCode(200)
  async listSub(@Req() req: AuthorizedPaginationApiRequest) {
    const { query, auth } = req
    const { order } = req?.pagination
    const tournamentId = +query?.tournamentId || 0

    const ds = await prepareConnection()
    const repo = ds.getRepository(Category)

    const userId = auth?.userId
    const user = await ds.getRepository(User).findOne({ where: { id: userId }, select: { id: true, gender: true } })
    if (!user) throw new BadRequestException('Usuário inválido')

    const queryDb = repo
      .createQueryBuilder('Category')
      .select()
      .addSelect(['Tournament.id', 'Tournament.title', 'Tournament.maxSubscription'])
      .innerJoin('Category.tournament', 'Tournament')
      .where({ published: true, tournamentId })
      .andWhere(`Category.gender = :gender OR Category.gender = 'MF'`, { gender: user.gender })

    if (userId) {
      queryDb
        .addSelect(['Subscription.id', 'Subscription.paid', 'Subscription.actived'])
        .leftJoin('Category.subscriptions', 'Subscription', 'Subscription.userId = :userId AND Subscription.actived = :actived', {
          userId,
          actived: true
        })
    }

    parseOrderDto({ order, table: 'Category', orderFields }).querySetup(queryDb)

    const categories = await queryDb.getMany()

    return { success: true, categories }
  }

  @Get('/list')
  @IfAuth()
  @Pagination()
  @HttpCode(200)
  async list(@Req() req: AuthorizedPaginationApiRequest) {
    const { query, auth } = req
    const { order } = req?.pagination
    const tournamentId = +query?.tournamentId || 0

    const userId = auth?.userId

    const ds = await prepareConnection()
    const repo = ds.getRepository(Category)

    const where: any = { tournamentId }
    if (auth?.level < 8) where.published = true

    const queryDb = repo
      .createQueryBuilder('Category')
      .select()
      .addSelect(['Tournament.id', 'Tournament.title', 'Tournament.maxSubscription'])
      .innerJoin('Category.tournament', 'Tournament')
      .where(where)

    if (userId) {
      queryDb
        .addSelect(['Subscription.id', 'Subscription.paid', 'Subscription.actived'])
        .leftJoin('Category.subscriptions', 'Subscription', 'Subscription.userId = :userId AND Subscription.actived = :actived', {
          userId,
          actived: true
        })
    }

    parseOrderDto({ order, table: 'Category', orderFields }).querySetup(queryDb)

    const categories = await queryDb.getMany()

    return { success: true, categories }
  }

  @Get('/:categoryId')
  @IfAuth()
  @HttpCode(200)
  async one(@Req() req: AuthorizedApiRequest) {
    const { auth, query } = req
    const categoryId = +query?.params[0] || 0

    if (!categoryId) throw new BadRequestException('Categoria não encontrada')

    const ds = await prepareConnection()
    const repo = ds.getRepository(Category)
    const where: FindOptionsWhere<Category> = { id: categoryId }
    if (auth?.level < 8) where.published = true

    const category = await repo.findOne({ where })

    if (!category) throw new BadRequestException(`Erro ao localizar categoria level=${auth?.level} ${categoryId}`)

    return { success: true, category }
  }

  @Patch('/:categoryId')
  @JwtAuthGuard()
  @HttpCode(200)
  async update(@Req() req: AuthorizedApiRequest) {
    const { auth, query, body } = req
    const categoryId = +query?.params[0] || 0
    if (!categoryId) throw new BadRequestException()

    const ds = await prepareConnection()
    const repo = ds.getRepository(Category)
    const category = await repo.update(categoryId, { ...body, updatedAt: new Date(), updatedBy: auth.userId })
    if (!category) throw new BadRequestException()

    return { success: true, categoryId, affected: category?.affected }
  }

  @Delete('/:categoryId')
  @JwtAuthGuard()
  @HttpCode(200)
  async remove(@Req() req: AuthorizedApiRequest) {
    const { query } = req
    const categoryId = +query?.params[0] || 0
    if (!categoryId) throw new BadRequestException()

    const ds = await prepareConnection()
    const repo = ds.getRepository(Category)
    const deleted = await repo.delete(categoryId)
    if (!deleted) throw new BadRequestException()

    return { success: true, categoryId, affected: deleted?.affected }
  }

  @Get()
  @HttpCode(200)
  @Pagination()
  async paginate(@Req() req: AuthorizedPaginationApiRequest) {
    const ds = await prepareConnection()
    const repo = ds.getRepository(Category)

    const tournamentId = +req?.query?.tournamentId
    if (!tournamentId) throw new BadRequestException('not_found_tournamentId')

    const { search, order } = req.pagination
    const queryText = search ? searchFields.map(field => `Category.${field} LIKE :search`) : null

    const queryDb = repo
      .createQueryBuilder('Category')
      .select()
      .addSelect(['Tournament.title'])
      .innerJoin('Category.tournament', 'Tournament')
      .where({ tournamentId })

    if (queryText) queryDb.andWhere(`(${queryText.join(' OR ')})`, { search: `%${search}%` })
    parseOrderDto({ order, table: 'Category', orderFields }).querySetup(queryDb)

    const paginateService = new PaginateService('category')
    const paginated = await paginateService.paginate(queryDb, req.pagination)
    return { success: true, ...paginated }
  }

  @Post()
  @JwtAuthGuard()
  @HttpCode(201)
  async create(@Req() req: AuthorizedApiRequest) {
    const { auth, body } = req

    const ds = await prepareConnection()
    const repo = ds.getRepository(Category)
    const data = { ...body, createdAt: new Date(), createdBy: auth.userId, userId: auth.userId } as ICategory
    const saveData = repo.create(data)
    const created = await repo.save(saveData)
    if (!created) throw new BadRequestException()

    return { success: true, categoryId: created?.id, arena: created }
  }
}

export default createHandler(CategoryHandler)
