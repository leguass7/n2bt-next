import { IResponseApi } from '~/server-side/api.interface'

import { SubscriptionNoPartner } from './subscription-no-partner.entity'

export interface IResponseSubscriptionNoPartner extends IResponseApi {
  subscription: SubscriptionNoPartner
}
