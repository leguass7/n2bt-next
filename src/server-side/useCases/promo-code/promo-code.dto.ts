import type { DeepPartial } from 'typeorm'

import type { IResponseApi } from '~/server-side/api.interface'

import type { PromoCode } from './promo-code.entity'

export type IPromoCode = DeepPartial<PromoCode>

export interface IResponsePromoCode extends IResponseApi {
  promoCodes: IPromoCode[]
  promoCode: IPromoCode
  promoCodeId: number
}
