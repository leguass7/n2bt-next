import { BadRequestException, createHandler, Delete, Get, HttpCode, Patch, Post, Req } from 'next-api-decorators'

import { generatePromoCode } from '~/helpers/string'
import { getRepo } from '~/server-side/database/conn'
import { parseOrderDto } from '~/server-side/database/db.helper'
import { Pagination } from '~/server-side/services/PaginateService'
import type { AuthorizedPaginationApiRequest } from '~/server-side/services/PaginateService/paginate.middleware'
import type { AuthorizedApiRequest } from '~/server-side/useCases/auth/auth.dto'
import { AdminAuth } from '~/server-side/useCases/auth/middleware'
import type { IPromoCode } from '~/server-side/useCases/promo-code/promo-code.dto'
import { PromoCode } from '~/server-side/useCases/promo-code/promo-code.entity'

const searchFields = ['id', 'label']
const orderFields = [
  ['PromoCode.id', 'id'],
  ['PromoCode.label', 'title']
]

class PromoCodeHandler {
  @Get('/list')
  @AdminAuth(9)()
  @Pagination()
  @HttpCode(200)
  async list(@Req() req: AuthorizedPaginationApiRequest) {
    const { query } = req
    const { order, search } = req?.pagination
    const tournamentId = +query?.tournamentId || 0
    if (!tournamentId) throw new BadRequestException(`Erro ao localizar torneio`)

    const whereText = search ? searchFields.map(f => `PromoCode.${f} LIKE '%:search%'`) : null
    const repo = await getRepo(PromoCode)

    const queryDb = repo
      .createQueryBuilder('PromoCode')
      .select()
      .addSelect(['Tournament.id', 'Tournament.title'])
      .addSelect(['Payment.id', 'Payment.actived', 'Payment.paid', 'Payment.createdAt'])
      .innerJoin('PromoCode.tournament', 'Tournament')
      .leftJoin('PromoCode.payments', 'Payment')
      .where('PromoCode.tournamentId = :tournamentId', { tournamentId })

    if (whereText) query.andWhere(`(${whereText.join(' OR ')})`, { search })

    parseOrderDto({ order, table: 'PromoCode', orderFields }).querySetup(queryDb)

    const promoCodes = await queryDb.getMany()

    return { success: true, data: promoCodes }
  }

  @Get('/:promoCodeId')
  @AdminAuth(9)()
  @HttpCode(200)
  async one(@Req() req: AuthorizedApiRequest) {
    const { query } = req
    const promoCodeId = +query?.params[0] || 0

    if (!promoCodeId) throw new BadRequestException('Código não encontrado')
    const repo = await getRepo(PromoCode)
    const promoCode = await repo.findOne({ where: { id: promoCodeId } })

    if (!promoCode) throw new BadRequestException(`Erro ao localizar recurso ${promoCodeId}`)
    return { success: true, promoCode }
  }

  @Patch('/:promoCodeId')
  @AdminAuth(9)()
  @HttpCode(200)
  async update(@Req() req: AuthorizedApiRequest<IPromoCode>) {
    const { auth, query, body } = req
    const promoCodeId = +query?.params[0] || 0
    if (!promoCodeId) throw new BadRequestException()

    const repo = await getRepo(PromoCode)
    const promoCode = await repo.update(promoCodeId, { ...body, updatedAt: new Date(), updatedBy: auth.userId })
    if (!promoCode) throw new BadRequestException()

    return { success: true, promoCodeId, affected: promoCode?.affected }
  }

  @Post()
  @AdminAuth(9)()
  @HttpCode(201)
  async create(@Req() req: AuthorizedApiRequest<IPromoCode>) {
    const { auth, body } = req

    const code = generatePromoCode(8)

    const repo = await getRepo(PromoCode)
    const data: IPromoCode = { ...body, createdAt: new Date(), createdBy: auth.userId, code }
    const saveData = repo.create(data)
    const created = await repo.save(saveData)
    if (!created) throw new BadRequestException()

    return { success: true, categoryId: created?.id, arena: created }
  }

  @Delete('/:promoCodeId')
  @AdminAuth(9)()
  @HttpCode(200)
  async remove(@Req() req: AuthorizedApiRequest) {
    const { query } = req
    const promoCodeId = +query?.params[0] || 0
    if (!promoCodeId) throw new BadRequestException(`Recurso não encontrado ${promoCodeId}`)
    const repo = await getRepo(PromoCode)

    // verificar se pode remover
    const queryAllowed = repo
      .createQueryBuilder('PromoCode')
      .select(['PromoCode.id'])
      .addSelect(['Payment.id', 'Payment.actived', 'Payment.paid'])
      .leftJoin('PromoCode.payments', 'Payment')
      .where('PromoCode.id = :promoCodeId', { promoCodeId })
    const allowed = !!(((await queryAllowed.getOne())?.payments?.length || 0) <= 0)
    if (!allowed) throw new BadRequestException(`Código promocional está sendo utilizado`)

    // remover código
    const deleted = await repo.delete(promoCodeId)
    if (!deleted) throw new BadRequestException(`Recurso não removido ${promoCodeId}`)
    return { success: true, promoCodeId, affected: deleted?.affected }
  }
}

export default createHandler(PromoCodeHandler)
