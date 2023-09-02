import type { IRequestCreateImmediateCharge } from 'brpix-api-node'

import type { IResponseApi } from '~/server-side/api.interface'
import type { IUser } from '~/server-side/useCases/user/user.dto'

import { type Payment } from './payment.entity'

export enum PaymentMethod {
  PIX = 'PIX',
  CASH = 'CASH',
  LINK = 'LINK'
}

export type CobStatus = 'ATIVA' | 'CONCLUIDA' | 'REMOVIDA_PELO_USUARIO_RECEBEDOR' | 'REMOVIDA_PELO_PSP'

export interface IResponseCob {
  txid: string
  calendario: {
    criacao: string
    expiracao: number
  }
  revisao: number
  loc: {
    id: number
    location: string
    tipoCob: string
    criacao: string
  }
  status: CobStatus
  location: string
  devedor: {
    cpf?: string
    cnpj?: string
    nome?: string
  }
  valor: {
    original: string
  }
  chave: string
  solicitacaoPagador: string
  infoAdicionais?: {
    nome: string
    valor: string
  }[]
}

export interface IResponseGeneratePix extends IResponseApi {
  paid?: boolean
  sent?: boolean
  imageQrcode?: string
  qrcode?: string
  paymentId?: number
  txid?: string
  expires?: number
}

export interface IResponsePayments extends IResponseApi {
  payments: Payment[]
}

export type PaymentMeta = { loc?: IResponseCob['loc']; horario?: Date | string; endToEndId?: string }

export type GeneratePayment = {
  user: IUser
  value: number
  infos?: IRequestCreateImmediateCharge['infoAdicionais']
  paymentId: number | string
  pixKey?: string
  expiracao: number
}

export type ResultPixPaid = {
  endToEndId: string
  txid: string
  valor: string
  chave: string
  horario: Date
}

export interface ResponseApiPixEndToEnd {
  data: {
    endToEndId: string
    valor: string
    chave: string
    horario: Date
  }
  success: true
}
