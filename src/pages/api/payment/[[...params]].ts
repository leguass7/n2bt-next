import { BadRequestException, createHandler, HttpCode, InternalServerErrorException, Post, Req } from '@storyofams/next-api-decorators'
import { addHours } from 'date-fns'

import { prepareConnection } from '~/server-side/database/conn'
import type { AuthorizedApiRequest } from '~/server-side/useCases/auth/auth.dto'
import { JwtAuthGuard } from '~/server-side/useCases/auth/middleware'
import { IResponseGeneratePix } from '~/server-side/useCases/payment/payment.dto'
import { Payment } from '~/server-side/useCases/payment/payment.entity'
import { Subscription } from '~/server-side/useCases/subscriptions/subscriptions.entity'
import { User } from '~/server-side/useCases/user/user.entity'

interface IPixQuery {
  subscriptionId?: string
}

class PaymentHandler {
  @Post('/pix/generate')
  @JwtAuthGuard()
  @HttpCode(201)
  async createPayment(@Req() req: AuthorizedApiRequest<Partial<Payment>, IPixQuery>): Promise<IResponseGeneratePix> {
    const { userId } = req.auth
    if (!userId) throw new BadRequestException('Usuário não encontrado, por favor, logue novamente')

    // Pegar id da inscrição
    const { subscriptionId } = req.query
    if (!subscriptionId) throw new BadRequestException('Não encontramos sua inscrição, por favor, tente novamente')

    // Definir overdue

    const ds = await prepareConnection()
    const repo = ds.getRepository(Payment)

    const overrides = { userId, updatedBy: userId, createdBy: userId }

    // criar pagamento
    const paymentData = repo.create({ ...req.body, ...overrides })

    const payment = await repo.save(paymentData)
    if (!payment) throw new InternalServerErrorException('Erro na criação do pagamento')

    // update subscription with payment id
    const subscriptionRepo = ds.getRepository(Subscription)
    const subscription = await subscriptionRepo.findOne({ where: { id: subscriptionId }, relations: ['category'] })
    if (!subscription) throw new InternalServerErrorException('Erro na atualização da inscrição')
    await subscriptionRepo.update(subscriptionId, { paymentId: payment.id })

    // pegar dados do usuário
    const userRepo = ds.getRepository(User)
    const user = await userRepo.findOne({ where: { id: userId } })
    if (!user?.cpf) throw new BadRequestException('O CPF é necessário para gerar o pix, por favor, atualize suas informações')

    return {
      expiresIn: addHours(new Date(), 1),
      status: 'ATIVA',
      txid: '217398127398712 qualquer coisa',
      txKey: '1283829784 chave qualquer'
    }

    // gerar cobrança

    // const expiracao = differenceInSeconds(subscription.category.tournament.expires,new Date())

    // const pixApi = await createApiPix()

    // pixApi.createCob({
    //   devedor: { cpf: user.cpf },
    //   valor: { original: Number(`${subscription?.value || 0}`).toFixed(2) },
    //   calendario: { expiracao: 3600 },
    //   solicitacaoPagador: `N2 BT ${payment.id}`
    // })
  }
}

export default createHandler(PaymentHandler)
