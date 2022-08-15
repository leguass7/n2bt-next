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

export type PaymentMeta = { loc?: IResponseCob['loc']; horario?: Date | string; endToEndId?: string }
