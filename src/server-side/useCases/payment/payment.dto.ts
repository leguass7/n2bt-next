import type { IRequestCreateImmediateCharge } from 'brpix-api-node'

import type { IResponseApi } from '~/server-side/api.interface'
import type { IUser } from '~/server-side/useCases/user/user.dto'

export enum PaymentMethod {
  PIX = 'PIX',
  CASH = 'CASH'
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
  imageQrcode?: string
  qrcode?: string
  paymentId?: number
  txid?: string
  expires?: number
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
