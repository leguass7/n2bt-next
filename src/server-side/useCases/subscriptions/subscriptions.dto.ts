import type { IResponseApi } from '~/server-side/api.interface'

import { Subscription } from './subscriptions.entity'

export type ISubscription = Partial<Subscription>

export interface IResponseSubscription extends IResponseApi {
  subscriptionId?: number
  subscription?: ISubscription
}

export interface IResponseSubscriptions extends IResponseApi {
  subscriptions?: ISubscription[]
}

export interface IResponseSubscriptionSummary extends IResponseApi {
  total?: number
}

export type TransferCategoryType = {
  subscriptionId: number
  userId: string
  categoryId: number
}
export interface IRequestSubscriptionTransfer {
  to: TransferCategoryType[]
}
