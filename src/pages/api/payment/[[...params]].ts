import { differenceInMinutes } from 'date-fns'
import { BadRequestException, createHandler, Get, HttpCode, Post, Query, Req, ValidationPipe } from 'next-api-decorators'
import { type FindOptionsWhere } from 'typeorm'

import { siteName } from '~/config/constants'
import { compareValues } from '~/helpers/array'
import { mergeDeep } from '~/helpers/object'
import { prepareConnection } from '~/server-side/database/conn'
import { createEmailService } from '~/server-side/services/EmailService'
import { createApiPix } from '~/server-side/services/pix'
import type { AuthorizedApiRequest } from '~/server-side/useCases/auth/auth.dto'
import { JwtAuthGuard } from '~/server-side/useCases/auth/middleware'
import { PaymentMethod, type ResponseApiPixEndToEnd } from '~/server-side/useCases/payment/payment.dto'
import { Payment } from '~/server-side/useCases/payment/payment.entity'
import { checkPaymentService, generatePaymentService, PaymentService } from '~/server-side/useCases/payment/payment.service'
import { PromoCode } from '~/server-side/useCases/promo-code/promo-code.entity'
import { Subscription } from '~/server-side/useCases/subscriptions/subscriptions.entity'
import { User } from '~/server-side/useCases/user/user.entity'

import { valueWithDiscount } from './payment.helper'
import { type SearchPaymentDto } from './search-payment.dto'

type RequestGenaratePayment = {
  code?: string
  noPartner?: boolean
  type: PaymentMethod
}

type RequestResendPayment = {
  paymentIds: number[]
}

const Pipe = ValidationPipe({ whitelist: true })

class PaymentHandler {
  @Post('/check/:paymentId')
  @JwtAuthGuard()
  @HttpCode(200)
  async check(@Req() req: AuthorizedApiRequest<{ disableqrcode?: boolean }>) {
    const { auth, query, body } = req
    const userId = auth?.userId
    const paymentId = +query?.params[1] || 0
    const disableqrcode = !!body?.disableqrcode

    if (!paymentId) throw new BadRequestException('Pagamento inválido')
    if (!userId) throw new BadRequestException('Usuário inválida')

    const ds = await prepareConnection()

    const check = await checkPaymentService(ds, { userId, paymentId, disableqrcode })
    if (!check?.success) throw new BadRequestException(`${check?.message || 'Erro ao verificar pagamento'}`)
    if (!!check?.paid) {
      if (!check?.sent) {
        const paymentService = new PaymentService(ds)
        const payment = await paymentService.getOne(paymentId, true)
        if (!payment?.user?.email) throw new BadRequestException('Usuário sem e-mail cadastrado')

        const subscription = payment?.subscriptions?.sort(compareValues('createdAt', 'desc'))?.[0]
        if (!subscription) throw new BadRequestException('Inscrição não encontrada')

        const categories = payment?.subscriptions?.map(sub => sub?.category?.title)
        const mailService = createEmailService()
        const sent = await mailService.send({
          from: `"${siteName} <lesbr3@gmail.com>"`,
          subject: `${siteName} - Pagamento recebido`,
          to: payment.user.email,
          html: `<p>Ol&aacute; ${payment?.user?.name} seu pagamento foi confirmado: <br />
          Torneio: <strong>${subscription?.category?.tournament?.title}</strong><br />
          ${categories?.join('<br />')}
          <br />
          <p/>`
        })
        if (sent?.accepted?.length) await paymentService.store({ id: paymentId, sent: true })
      }
      throw new BadRequestException('Pagamento já foi realizado')
    }

    return { success: true, ...check }
  }

  @Post('/resend')
  @JwtAuthGuard()
  @HttpCode(200)
  async resendPayment(@Req() req: AuthorizedApiRequest<RequestResendPayment>) {
    const { body } = req
    const { paymentIds = [] } = body
    return { success: true, paymentIds }
  }

  @Post('/generate/:subscriptionId')
  @JwtAuthGuard()
  @HttpCode(201)
  async generateBySubscription(@Req() req: AuthorizedApiRequest<RequestGenaratePayment>) {
    const { auth, query, body } = req
    const subscriptionId = +query?.params[1] || 0
    if (!subscriptionId) throw new BadRequestException('Número de incrição inválido')

    const userId = auth?.userId
    if (!userId) throw new BadRequestException('Usuário não encontrado')

    const { type = PaymentMethod.PIX, code } = body

    const ds = await prepareConnection()
    const repo = ds.getRepository(Subscription)

    const subscription = await repo
      .createQueryBuilder('Subscription')
      .select()
      .addSelect(['Category.id', 'Category.tournamentId', 'Category.price'])
      .addSelect(['Tournament.id', 'Tournament.arenaId', 'Tournament.published', 'Tournament.subscriptionEnd'])
      .innerJoin('Subscription.category', 'Category')
      .innerJoin('Category.tournament', 'Tournament')
      .leftJoin('Subscription.payment', 'Payment')
      .where({ id: subscriptionId, actived: true, userId })
      .getOne()
    if (!subscriptionId) throw new BadRequestException('Número de inscrição não encontrado')
    if (subscription?.paid) throw new BadRequestException('Inscrição já está paga')

    const price = subscription?.value || subscription?.category?.price
    if (!price) throw new BadRequestException('Inscrição sem preço')

    const promoRepo = ds.getRepository(PromoCode)
    const repoPay = ds.getRepository(Payment)

    const promo = code ? await promoRepo.findOne({ where: { actived: true, code } }) : null
    const paymentsWithPromo = promo?.id ? await repoPay.find({ where: { promoCodeId: promo?.id } }) : []

    const notExpired = paymentsWithPromo?.length < promo?.usageLimit
    const usedByUser = paymentsWithPromo?.find?.(payment => payment.userId === userId)
    const applyDiscount = notExpired && !usedByUser

    const priceWithDiscount = applyDiscount ? valueWithDiscount(price, promo?.discount || 0) : price

    const overdue = subscription?.category?.tournament?.subscriptionEnd
    if (!overdue) throw new BadRequestException('Data de vencimento inválida')

    if (subscription?.payment) {
      if (subscription?.payment?.paid) {
        await repo.update(subscription?.id, { paid: true })
        throw new BadRequestException('Pagamento já realizado')
      }
      // adquirir dados de pagamento e responser ao cliente
      return { success: true }
    }

    // gerar pagamento
    const payment = await repoPay.save({
      actived: true,
      createdBy: userId,
      userId,
      overdue,
      value: priceWithDiscount,
      promoCodeId: promo?.id,
      method: type
    })
    if (!payment) throw new BadRequestException('Erro ao criar pagamento')
    await repo.update(subscription?.id, { paymentId: payment.id })

    if (type === PaymentMethod.PIX) {
      // PIX
      const user = await ds.getRepository(User).findOneBy({ id: userId })
      if (!user) throw new BadRequestException('Erro recuperar usuário')

      const apiPix = await createApiPix()
      const expiracao = differenceInMinutes(overdue, new Date())

      const cob = await generatePaymentService(apiPix, { expiracao, paymentId: payment?.id, user, value: priceWithDiscount })
      if (!cob || !cob?.success) {
        // eslint-disable-next-line no-console
        console.error(cob?.message, cob?.messageError)
        throw new BadRequestException('Erro ao criar PIX')
      }

      // atualiza pagamento
      const meta = mergeDeep({ ...payment?.meta }, { loc: cob?.loc })
      repoPay.update(payment.id, { meta, txid: cob.txid, updatedBy: userId })

      return {
        success: true,
        imageQrcode: cob?.imagemQrcode,
        qrcode: cob?.qrcode,
        paymentId: payment?.id,
        txid: cob?.txid,
        expires: expiracao
      }
    }

    return {
      success: false,
      message: 'Método de pagamento não implementado'
    }
  }

  @Get('/search')
  @JwtAuthGuard()
  async search(@Query(Pipe) filter: SearchPaymentDto) {
    const ds = await prepareConnection()
    const repo = ds.getRepository(Payment)

    const tournamentId = filter.tournamentId
    delete filter.tournamentId

    const where: FindOptionsWhere<Payment> = { ...filter, subscriptions: { category: { tournamentId } } }
    const payments = await repo.find({ where })

    return { payments }
  }

  @Post('/:paymentId')
  @JwtAuthGuard()
  @HttpCode(200)
  async manualPayment(@Req() req: AuthorizedApiRequest) {
    const { auth, body, query } = req
    const paymentId = +(query?.paymentId || query?.params[0])
    const e2eId = body?.e2eId as string
    const userId = auth?.userId
    if (!userId) throw new BadRequestException('Usuário inválido')

    const ds = await prepareConnection()
    const repo = ds.getRepository(Payment)

    const payment = await repo.findOne({ where: { id: paymentId } })
    if (!payment) throw new BadRequestException('Pagamento inválido')

    const apiPix = await createApiPix()
    const response = await apiPix.requestApi<ResponseApiPixEndToEnd>('get', `/v2/pix/${e2eId}`)
    if (!response?.success) throw new BadRequestException('Identificador não localizado')

    const payData = response?.data
    const updatedBy = auth.userId

    await repo.update(paymentId, {
      updatedBy,
      value: Number(payData?.valor),
      txid: payData.endToEndId,
      paid: true,
      payday: payData?.horario
    })

    await ds.getRepository(Subscription).createQueryBuilder().update({ paid: true, updatedBy: userId }).where({ paymentId: payment.id }).execute()

    return { success: true, paymentId, e2eId, paid: true }
  }
}

export default createHandler(PaymentHandler)
