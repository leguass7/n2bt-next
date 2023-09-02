import type { ApiPix, IResponseCob, IResponseQrcode } from 'brpix-api-node'
import type { DataSource, FindOptionsWhere, DeepPartial } from 'typeorm'

import { mergeDeep } from '~/helpers/object'
import { removeAll } from '~/helpers/string'
import { createApiPix } from '~/server-side/services/pix'
import { Subscription } from '~/server-side/useCases/subscriptions/subscriptions.entity'

import type { GeneratePayment, IResponseGeneratePix, PaymentMeta, ResultPixPaid } from './payment.dto'
import { Payment } from './payment.entity'

export type InfoPix = IResponseCob & { pix: ResultPixPaid[] }
type Options = {
  paymentId: number
  userId: string
  disableqrcode?: boolean
}
export async function checkPaymentService(ds: DataSource, { paymentId, disableqrcode, userId }: Options): Promise<IResponseGeneratePix> {
  const repoPay = ds.getRepository(Payment)
  const payment = await repoPay.findOne({ where: { id: paymentId } })
  if (!payment) return { success: true, message: 'Pagamento não encontrado' }

  const paymentMeta = { ...payment?.meta } as PaymentMeta

  const apiPix = await createApiPix()
  const cob = await apiPix.consultCob(payment.txid)
  const result: IResponseGeneratePix = { imageQrcode: '', qrcode: '', txid: payment?.txid, paymentId: payment.id }

  // salvar caso seja pago
  if (cob?.status === 'CONCLUIDA') {
    // FIXME: Melhorar lógica (deixar mais compreensível)
    const pixInfo = { ...cob } as InfoPix
    const pix = pixInfo?.pix.find(f => f.txid === payment.txid)
    const payday = pix ? pix.horario : undefined
    const meta = pix ? mergeDeep({}, paymentMeta, { endToEndId: pix?.endToEndId, horario: pix?.horario }) : undefined
    await repoPay.update(payment.id, { paid: true, payday, meta, updatedBy: userId })
    await ds.getRepository(Subscription).createQueryBuilder().update({ paid: true, updatedBy: userId }).where({ paymentId: payment.id }).execute()
    result.paid = !!payment?.paid
  } else if (paymentMeta?.loc?.id && !disableqrcode) {
    const pay = await apiPix.qrcodeByLocation(paymentMeta?.loc?.id)
    result.imageQrcode = pay?.imagemQrcode
    result.qrcode = pay?.qrcode
  }

  return {
    success: true,
    paid: !!payment?.paid,
    sent: !!payment?.sent,
    ...result
  }
}

type ResponseGenerate = Partial<IResponseQrcode> & Partial<IResponseCob> & { success: boolean; message?: string }
export async function generatePaymentService(
  apiPix: ApiPix,
  { user, value, infos: infoAdicionais, paymentId, pixKey: chave, expiracao }: GeneratePayment
): Promise<ResponseGenerate> {
  const cob = (await apiPix.createCob({
    calendario: { expiracao },
    devedor: { cpf: removeAll(user?.cpf), nome: user.name },
    valor: { original: Number(`${value}`).toFixed(2) },
    chave: chave || 'lesbr3@gmail.com',
    solicitacaoPagador: `ARENA BT ${paymentId}`,
    infoAdicionais
  })) as Partial<IResponseCob> & { responseError?: { mensagem?: string } }

  if (!cob || !cob?.txid || !cob.loc) {
    return { success: false, message: cob?.responseError?.mensagem || 'generate PIX function error' }
  }

  const qrcode = await apiPix.qrcodeByLocation(cob.loc.id)
  return { success: true, ...cob, ...qrcode }
}

export class PaymentService {
  constructor(private readonly ds: DataSource) {}

  async findOne(where: FindOptionsWhere<Payment>) {
    const repo = this.ds.getRepository(Payment)
    const query = repo.createQueryBuilder('Payment').innerJoin('Payment.user', 'User').addSelect(['User.name', 'User.email']).where(where)
    const payment = await query.getOne()
    return payment
  }

  async getOne(paymentId: number, relations?: boolean) {
    const repo = this.ds.getRepository(Payment)
    const query = repo
      .createQueryBuilder('Payment')
      .innerJoin('Payment.user', 'User')
      .addSelect(['User.name', 'User.email'])
      .where('Payment.id = :paymentId', { paymentId })

    if (relations) {
      query
        .leftJoin('Payment.subscriptions', 'Subscription')
        .addSelect(['Subscription.id', 'Subscription.userId', 'Subscription.categoryId'])
        .innerJoin('Subscription.category', 'Category')
        .addSelect(['Category.id', 'Category.title'])
        .innerJoin('Category.tournament', 'Tournament')
        .addSelect(['Tournament.id', 'Tournament.title'])
    }

    const payment = await query.getOne()
    return payment
  }

  async store(data: DeepPartial<Payment>) {
    const repo = this.ds.getRepository(Payment)
    const toSave = repo.create(data)
    const payment = await repo.save(toSave)
    return payment
  }

  async update(subscriptionId: number, data: DeepPartial<Payment>) {
    const repo = this.ds.getRepository(Payment)
    const result = await repo.update(subscriptionId, { ...data, updatedAt: new Date() })
    return result
  }
}
