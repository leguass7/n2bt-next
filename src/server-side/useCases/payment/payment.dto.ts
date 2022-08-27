import { IResponseApi } from '~/server-side/api.interface'

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
  txid: string
  status: CobStatus
  expiresIn: Date
  txKey: string
}

export type PaymentMeta = { loc?: IResponseCob['loc']; horario?: Date | string; endToEndId?: string }
