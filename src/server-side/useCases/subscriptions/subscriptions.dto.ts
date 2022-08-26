import type { IResponseApi } from '~/server-side/api.interface'

import { Subscription } from './subscriptions.entity'

export type IUser = Partial<Subscription>

export interface IResponseCreateSubscription extends IResponseApi {
  subscriptionId?: string
}
