import { isDefined } from 'class-validator'
import { add, differenceInMinutes } from 'date-fns'
import type { NextApiResponse } from 'next'
import {
  BadRequestException,
  createHandler,
  ForbiddenException,
  Get,
  HttpCode,
  HttpException,
  Patch,
  Post,
  Query,
  Req,
  Res,
  ValidationPipe
} from 'next-api-decorators'

import { siteName } from '~/config/constants'
import { formatPrice } from '~/helpers'
import { tryDate } from '~/helpers/dates'
import { mergeDeep } from '~/helpers/object'
import { prepareConnection } from '~/server-side/database/conn'
import { parseOrderDto } from '~/server-side/database/db.helper'
import { createEmailService } from '~/server-side/services/EmailService'
import { PaginateService, Pagination } from '~/server-side/services/PaginateService'
import type { AuthorizedPaginationApiRequest } from '~/server-side/services/PaginateService/paginate.middleware'
import { createApiPix } from '~/server-side/services/pix'
import { factoryXlsxService } from '~/server-side/services/XlsxService'
import type { AuthorizedApiRequest } from '~/server-side/useCases/auth/auth.dto'
import { JwtAuthGuard, IfAuth } from '~/server-side/useCases/auth/middleware'
import { type GeneratePayment } from '~/server-side/useCases/payment/payment.dto'
import { generatePaymentService, PaymentService } from '~/server-side/useCases/payment/payment.service'
import { subscriptionToSheetDto } from '~/server-side/useCases/subscriptions/subscription.helper'
import { SubscriptionService } from '~/server-side/useCases/subscriptions/subscription.service'
import type { RequestResendSubscription, IRequestSubscriptionTransfer } from '~/server-side/useCases/subscriptions/subscriptions.dto'
import { Subscription } from '~/server-side/useCases/subscriptions/subscriptions.entity'

import { type SubscriptionReportFilterDto } from './subscription-report-filter.dto'

const Pipe = ValidationPipe({ whitelist: true })

const userSearchFields = ['id', 'name', 'email', 'cpf', 'phone', 'nick']
const searchFields = ['Subscription.id', 'User.name', 'Partner.name']
const orderFields = [
  ['Subscription.id', 'id'],
  ['User.name', 'user', 'name'],
  ['Partner.name', 'partner']
]

class SubscriptionHandler {
  @Post('/resend')
  @JwtAuthGuard()
  @HttpCode(200)
  async resendPaymentSubscription(@Req() req: AuthorizedApiRequest<RequestResendSubscription>) {
    const { body, auth } = req
    const { subscriptionIds = [] } = body

    const ds = await prepareConnection()

    const all = subscriptionIds.map(async subscriptionId => {
      const subscriptionService = new SubscriptionService(ds)
      const subscription = await subscriptionService.getOne(subscriptionId, true)
      if (subscription?.paid || subscription?.payment?.paid) return false

      const apiPix = await createApiPix()

      // verifica se pagamento está vencido
      let payment = subscription?.payment
      let overdue = tryDate(payment?.overdue)
      const subscriptionEnd = tryDate(subscription?.category?.tournament?.subscriptionEnd)
      let imgQrCode = ''
      let qrcode = ''
      if (!payment || !overdue || (overdue && differenceInMinutes(new Date(), overdue) > 0)) {
        // verifica se torneio acabou e atualiza vencimento
        const diff = differenceInMinutes(new Date(), subscriptionEnd)
        if (!overdue || diff > 0) {
          overdue = add(new Date(), { days: 1 })
        }

        if (overdue && diff <= 0) {
          overdue = add(subscriptionEnd, { days: 1 })
        }

        // gerar pagamento
        const paymentService = new PaymentService(ds)
        const value = payment?.value || subscription?.value
        payment = await paymentService.store({
          ...payment,
          userId: subscription?.userId,
          actived: true,
          createdBy: auth?.userId,
          createdAt: new Date(),
          value,
          overdue
        })
        if (!payment) throw new BadRequestException('Erro ao criar pagamento')

        const subscriptionService = new SubscriptionService(ds)
        await subscriptionService.update(subscription.id, { paymentId: payment.id })

        const expiracao = differenceInMinutes(overdue, new Date())

        const p: GeneratePayment = { expiracao, paymentId: payment?.id, user: subscription.user, value }
        const cob = await generatePaymentService(apiPix, p)
        if (!cob || !cob?.success) {
          // eslint-disable-next-line no-console
          console.error('overdue', overdue, 'fim inscricao', subscriptionEnd, cob?.message, cob?.messageError)
          throw new BadRequestException('Erro ao criar PIX')
        }

        imgQrCode = cob?.imagemQrcode

        // atualiza pagamento
        const meta = mergeDeep({ ...payment?.meta }, { loc: cob?.loc })
        await paymentService.update(payment.id, { meta, txid: cob.txid, updatedBy: auth?.userId })
      }

      if (!imgQrCode && payment?.meta?.loc?.id) {
        const pay = await apiPix.qrcodeByLocation(payment.meta.loc.id)
        imgQrCode = pay?.imagemQrcode
        qrcode = pay?.qrcode
      }

      // envia email com pagamento
      const mailService = createEmailService()
      const sent = await mailService.send(
        {
          from: `"${siteName} <lesbr3@gmail.com>"`,
          subject: `${siteName} - Confirme sua inscrição`,
          to: subscription.user.email,
          html: `<p>Ol&aacute; ${subscription?.user?.name} sua inscrição ainda não foi confirmada:<br />
          Torneio: <strong>${subscription?.category?.tournament?.title}</strong><br />
          Categoria: <strong>${subscription?.category?.title}</strong><br />
          Clique no link para completar sua inscrição: <br />
          <a href="https://cea.avatarsolucoesdigitais.com.br/" target"__blank">https://cea.avatarsolucoesdigitais.com.br/</a>
          <br /><br />
          <strong>${payment?.value ? formatPrice(payment?.value) : '--'}</strong><br />
          <p/>
          <p>${qrcode ? `Código "copia e cola" para pagamento do PIX <br /><br /><a style="padding:16px"><code>${qrcode}</code></a>` : ''}</p>
          `
        },
        imgQrCode ? [{ filename: 'qrcode.png', content: imgQrCode?.split('base64,')?.[1], encoding: 'base64' }] : undefined
      )

      return sent
    })
    const result = await Promise.all(all)
    return { success: true, subscriptionIds, result }
  }

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
      .leftJoin('Subscription.partner', 'Partner')
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
  // @JwtAuthGuard()
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
      .leftJoin('Subscription.partner', 'Partner')
      .addSelect(['Payment.id', 'Payment.value'])
      .leftJoin('Subscription.payment', 'Payment')
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
      .leftJoin('Subscription.partner', 'Partner')
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

    const { categoryId, partnerId, value, paid } = body
    const userId = isAdmin ? body?.userId ?? currentUserId : currentUserId

    const newSubscription: Partial<Subscription> = {
      actived: true,
      paid: isAdmin ? !!paid : false,
      categoryId,
      partnerId,
      userId,
      createdBy: userId,
      value
    }

    const hasSubscription = await repo.findOne({ where: { categoryId, userId, actived: true } })
    if (hasSubscription) await repo.update(hasSubscription.id, { actived: false, updatedBy: currentUserId })

    const data = repo.create(newSubscription)
    const subscription = await repo.save(data)
    if (!subscription) throw new HttpException(500, 'erro na criação da inscrição')

    return { success: true, subscriptionId: subscription?.id, subscription }
  }

  @Get('/report/download')
  @JwtAuthGuard()
  async downloadReport(@Req() req: AuthorizedPaginationApiRequest, @Res() res: NextApiResponse) {
    const { auth, query } = req
    const isAdmin = !!(auth?.level >= 8)
    if (!isAdmin) throw new ForbiddenException()

    const tournamentId = +query?.tournamentId
    if (!tournamentId) throw new BadRequestException('Torneio não encontrado')

    const ds = await prepareConnection()
    const repo = ds.getRepository(Subscription)

    const repoQuery = repo
      .createQueryBuilder('Subscription')
      .select(['Subscription.id', 'Subscription.categoryId', 'Subscription.userId', 'Subscription.paid', 'Subscription.shirtDelivered'])
      .innerJoin('Subscription.category', 'Category')
      .innerJoin('Subscription.user', 'User')
      .addSelect(['Category.id', 'Category.tournamentId', 'Category.limit', 'Category.title'])
      .addSelect(['User.id', 'User.name', 'User.gender', 'User.nick', 'User.shirtSize', 'User.email', 'User.phone'])
      .where('Subscription.actived = :actived ', { actived: true })
      .distinct()
      .andWhere('Category.tournamentId = :tournamentId', { tournamentId })
      .orderBy('User.name', 'ASC')
      .addOrderBy('Subscription.paid', 'DESC')
      .groupBy('Subscription.userId')

    const subscriptions = await repoQuery.getMany()

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

    // return { success: true, subscriptions }
  }

  @Get('/report')
  @JwtAuthGuard()
  async report(@Req() req: AuthorizedPaginationApiRequest, @Query(Pipe) filter: SubscriptionReportFilterDto) {
    const { auth } = req

    const isAdmin = !!(auth?.level >= 8)
    if (!isAdmin) throw new ForbiddenException()

    const tournamentId = +filter?.tournamentId
    if (!tournamentId) throw new BadRequestException('Torneio não encontrado')

    const search = filter?.search

    const ds = await prepareConnection()
    const repo = ds.getRepository(Subscription)

    const repoQuery = repo
      .createQueryBuilder('Subscription')
      .select([
        'Subscription.id',
        'Subscription.categoryId',
        'Subscription.userId',
        'Subscription.paid',
        'Subscription.shirtDelivered',
        'Subscription.value'
      ])
      .innerJoin('Subscription.category', 'Category')
      .innerJoin('Subscription.user', 'User')
      .leftJoin('Subscription.payment', 'Payment')
      .leftJoin('Payment.promoCode', 'PromoCode')
      .addSelect(['Category.id', 'Category.tournamentId', 'Category.limit', 'Category.title'])
      .addSelect(['Payment.id', 'Payment.payday', 'Payment.actived', 'Payment.paid', 'Payment.value'])
      .addSelect(['PromoCode.code', 'PromoCode.label'])
      .addSelect(['User.id', 'User.name', 'User.gender', 'User.nick', 'User.shirtSize', 'User.email', 'User.phone'])
      .where('Subscription.actived = :actived', { actived: true })
      .distinct()
      .andWhere('Category.tournamentId = :tournamentId', { tournamentId })
      .orderBy('User.name', 'ASC')
      .addOrderBy('Subscription.paid', 'DESC')
    // .groupBy('Subscription.userId')

    if (search)
      repoQuery.andWhere(
        `( User.name LIKE :search OR User.nick LIKE :search OR User.email LIKE :search OR User.phone LIKE :search
          OR PromoCode.code LIKE :search )`,
        {
          search: `%${search}%`
        }
      )

    if (isDefined(filter.paid) && filter?.paid !== 'null') {
      repoQuery.andWhere(`Subscription.paid = :paid`, { paid: filter?.paid === 'true' })
    }

    const subscriptions = await repoQuery.getMany()

    const statistics: any = { total: subscriptions.length }

    statistics.sizes = subscriptions.reduce((ac, at) => {
      const size = at.user.shirtSize

      ac[size] = Object.hasOwn(ac, size) ? ac[size] + 1 : 1

      return ac
    }, {})

    statistics.categories = subscriptions.reduce((ac, at) => {
      const { title } = at.category

      ac[title] = Object.hasOwn(ac, title) ? ac[title] + 1 : 1

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
      .leftJoin('Subscription.partner', 'Partner')
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
