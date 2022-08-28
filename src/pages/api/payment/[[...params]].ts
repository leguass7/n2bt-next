import { BadRequestException, createHandler, Get, HttpCode, Post, Req } from '@storyofams/next-api-decorators'
import { differenceInMinutes } from 'date-fns'

import { mergeDeep } from '~/helpers/object'
import { prepareConnection } from '~/server-side/database/conn'
import { createApiPix } from '~/server-side/services/pix'
import type { AuthorizedApiRequest } from '~/server-side/useCases/auth/auth.dto'
import { JwtAuthGuard } from '~/server-side/useCases/auth/middleware'
import { PaymentMethod } from '~/server-side/useCases/payment/payment.dto'
import { Payment } from '~/server-side/useCases/payment/payment.entity'
import { checkPaymentService, generatePaymentService } from '~/server-side/useCases/payment/payment.service'
import { Subscription } from '~/server-side/useCases/subscriptions/subscriptions.entity'
import { User } from '~/server-side/useCases/user/user.entity'

// export async function generate(
//   apiPix: ApiPix,
//   { user, value, infos: infoAdicionais, paymentId, pixKey: chave, expiracao }: GeneratePayment
// ): Promise<ResponseGenerate> {
//   const cob = (await apiPix.createCob({
//     calendario: { expiracao },
//     devedor: { cpf: removeAll(user?.cpf), nome: user.name },
//     valor: { original: Number(`${value}`).toFixed(2) },
//     chave: chave || 'lesbr3@gmail.com',
//     solicitacaoPagador: `ARENA BT ${paymentId}`,
//     infoAdicionais
//   })) as Partial<IResponseCob> & { responseError?: { mensagem?: string } }

//   if (!cob || !cob?.txid || !cob.loc) {
//     return { success: false, message: cob?.responseError?.mensagem || 'generate PIX function errror' }
//   }

//   const qrcode = await apiPix.qrcodeByLocation(cob.loc.id)
//   return { success: true, ...cob, ...qrcode }
// }

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
    if (!!check?.paid) throw new BadRequestException('Pagamento já foi realizado')

    return {
      success: true,
      ...check
    }
  }
  // @Post('/check/:paymentId')
  // @IfAuth()
  // @HttpCode(200)
  // async check(@Req() req: AuthorizedApiRequest<{ disableqrcode?: boolean }>) {
  //   const { auth, query, body } = req
  //   const paymentId = +query?.params[1] || 0
  //   const disableqrcode = !!body?.disableqrcode

  //   const ds = await prepareConnection()
  //   const repoPay = ds.getRepository(Payment)
  //   const payment = await repoPay.findOne({ where: { id: paymentId } })
  //   if (!payment) throw new BadRequestException('Pagamento não encontrado')

  //   const paymentMeta = { ...payment?.meta } as PaymentMeta

  //   const apiPix = await createApiPix()
  //   const cob = await apiPix.consultCob(payment.txid)
  //   const result: IResponseGeneratePix = { imageQrcode: '', qrcode: '', txid: payment?.txid, paymentId: payment.id }

  //   // salvar caso seja pago
  //   if (cob?.status === 'CONCLUIDA') {
  //     // FIXME: Melhorar lógica (deixar mais compreensível)
  //     const pixInfo = { ...cob } as InfoPix
  //     const pix = pixInfo?.pix.find(f => f.txid === payment.txid)
  //     const payday = pix ? pix.horario : undefined
  //     const meta = pix ? mergeDeep({}, paymentMeta, { endToEndId: pix?.endToEndId, horario: pix?.horario }) : undefined
  //     await repoPay.update(payment.id, { paid: true, payday, meta, updatedBy: auth.userId })
  //     await ds
  //       .getRepository(Subscription)
  //       .createQueryBuilder()
  //       .update({ paid: true, updatedBy: auth.userId })
  //       .where({ paymentId: payment.id })
  //       .execute()
  //     result.paid = !!payment?.paid
  //   } else if (paymentMeta?.loc?.id && !disableqrcode) {
  //     const pay = await apiPix.qrcodeByLocation(paymentMeta?.loc?.id)
  //     result.imageQrcode = pay?.imagemQrcode
  //     result.qrcode = pay?.qrcode
  //   }

  //   return {
  //     success: true,
  //     paid: !!payment?.paid,
  //     ...result
  //   }
  // }

  @Get('/generate/:subscriptionId')
  @JwtAuthGuard()
  @HttpCode(201)
  async generateBySubscription(@Req() req: AuthorizedApiRequest<Partial<Payment>>) {
    const { auth, query } = req
    const subscriptionId = +query?.params[1] || 0
    if (!subscriptionId) throw new BadRequestException('Número de incrição inválido')

    const userId = auth?.userId
    if (!userId) throw new BadRequestException('Usuário não encontrado')

    const ds = await prepareConnection()
    const repoSub = ds.getRepository(Subscription)

    const subscription = await repoSub
      .createQueryBuilder('Subscription')
      .select()
      .addSelect(['Category.id', 'Category.tournamentId', 'Category.price'])
      .addSelect(['Tournament.id', 'Tournament.arenaId', 'Tournament.published', 'Tournament.subscriptionExpiration'])
      .innerJoin('Subscription.category', 'Category')
      .innerJoin('Category.tournament', 'Tournament')
      .leftJoin('Subscription.payment', 'Payment')
      .where({ id: subscriptionId, actived: true, userId })
      .getOne()
    if (!subscriptionId) throw new BadRequestException('Número de inscrição não encontrado')
    if (subscription?.paid) throw new BadRequestException('Inscrição já está paga')

    const price = subscription?.category?.price
    if (!price) throw new BadRequestException('Inscrição sem preço')

    const overdue = subscription?.category?.tournament?.subscriptionExpiration

    if (subscription?.payment) {
      if (subscription?.payment?.paid) {
        await repoSub.update(subscription?.id, { paid: true })
        throw new BadRequestException('Pagamento já realizado')
      }
      // adquirir dados de pagamento e responser ao cliente
      return { success: true }
    }

    // gerar pagamento
    const repoPay = ds.getRepository(Payment)
    const payment = await repoPay.save({ actived: true, createdBy: userId, userId, overdue, value: price, method: PaymentMethod.PIX })
    if (!payment) throw new BadRequestException('Erro ao criar pagamento')
    await repoSub.update(subscription?.id, { paymentId: payment.id })

    // PIX
    const user = await ds.getRepository(User).findOneBy({ id: userId })
    if (!user) throw new BadRequestException('Erro recuperar usuário')
    // const apiPix = await createApiPix(subscription?.category?.tournament?.arenaId)
    const apiPix = await createApiPix()
    const expiracao = differenceInMinutes(overdue, new Date())

    const cob = await generatePaymentService(apiPix, { expiracao, paymentId: payment?.id, user, value: price })
    if (!cob || !cob?.success) {
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

  // @Post('/pix/generate')
  // @JwtAuthGuard()
  // @HttpCode(201)
  // async createPayment(@Req() req: AuthorizedApiRequest<Partial<Payment>, IPixQuery>): Promise<IResponseGeneratePix> {
  //   const { userId } = req.auth
  //   if (!userId) throw new BadRequestException('Usuário não encontrado, por favor, logue novamente')

  //   // Pegar id da inscrição
  //   const subscriptionId = +req.query?.subscriptionId
  //   if (!subscriptionId) throw new BadRequestException('Não encontramos sua inscrição, por favor, tente novamente')

  //   // Definir overdue

  //   const ds = await prepareConnection()
  //   const repo = ds.getRepository(Payment)

  //   const overrides = { userId, updatedBy: userId, createdBy: userId }

  //   // criar pagamento
  //   const paymentData = repo.create({ ...req.body, ...overrides })

  //   const payment = await repo.save(paymentData)
  //   if (!payment) throw new InternalServerErrorException('Erro na criação do pagamento')

  //   // update subscription with payment id
  //   const subscriptionRepo = ds.getRepository(Subscription)
  //   const subscription = await subscriptionRepo.findOne({ where: { id: subscriptionId }, relations: ['category'] })
  //   if (!subscription) throw new InternalServerErrorException('Erro na atualização da inscrição')
  //   await subscriptionRepo.update(subscriptionId, { paymentId: payment.id })

  //   // pegar dados do usuário
  //   const userRepo = ds.getRepository(User)
  //   const user = await userRepo.findOne({ where: { id: userId } })
  //   if (!user?.cpf) throw new BadRequestException('O CPF é necessário para gerar o pix, por favor, atualize suas informações')

  //   return {
  //     expiresIn: addHours(new Date(), 1),
  //     status: 'ATIVA',
  //     txid: '217398127398712 qualquer coisa',
  //     txKey: '1283829784 chave qualquer'
  //   }

  // gerar cobrança

  // const expiracao = differenceInSeconds(subscription.category.tournament.expires,new Date())

  // const pixApi = await createApiPix()

  // pixApi.createCob({
  //   devedor: { cpf: user.cpf },
  //   valor: { original: Number(`${subscription?.value || 0}`).toFixed(2) },
  //   calendario: { expiracao: 3600 },
  //   solicitacaoPagador: `N2 BT ${payment.id}`
  // })
  // }
}

export default createHandler(PaymentHandler)
