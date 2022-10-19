import type { DeepPartial } from 'typeorm'

import type { IResponseApi } from '~/server-side/api.interface'

import type { Subscription } from './subscriptions.entity'

export enum ShirtStatus {
  WAITING = 'Em espera',
  PRODUCTION = 'Em produção',
  SENT = 'Enviado',
  DELIVERED = 'Entregue'
}

export type ISubscription = DeepPartial<Subscription>

export interface IResponseSubscription extends IResponseApi {
  subscriptionId?: number
  subscription?: ISubscription
}

export interface IResponseSubscriptions extends IResponseApi {
  subscriptions?: ISubscription[]
}

export interface IResponseSubscriptionsReport extends IResponseSubscriptions {
  // counters: Record<keyof typeof ShirtStatus, number>
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

export type SubscriptionReportCounter = Record<keyof typeof ShirtStatus, number>
