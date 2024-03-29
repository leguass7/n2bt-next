import type { DeepPartial } from 'typeorm'

import type { IResponseApi } from '~/server-side/api.interface'

import type { Subscription } from './subscriptions.entity'

export type ISubscription = DeepPartial<Subscription>

export type RequestResendSubscription = {
  subscriptionIds?: number[]
}

export interface IResponseSubscription extends IResponseApi {
  subscriptionId?: number
  subscription?: ISubscription
}

export interface IResponseSubscriptions extends IResponseApi {
  subscriptions?: ISubscription[]
}

export interface ISubscriptionStatistics {
  total: number
  sizes?: Record<string, number>
  categories?: Record<string, number>
}

export interface IResponseSubscriptionsReport extends IResponseSubscriptions {
  statistics: ISubscriptionStatistics
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

export interface SubscriptionSheetDto {
  name: string
  phone?: string
  category: string
  gender?: string
  paid?: any
  paymentId?: number
  amount?: number | string
  shirtSize?: string
}
