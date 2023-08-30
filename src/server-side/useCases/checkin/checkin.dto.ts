import type { DeepPartial } from 'typeorm'

import type { IResponseApi } from '~/server-side/api.interface'

import { type Checkin } from './checkin.entity'

export type ICheckin = DeepPartial<Checkin>

export interface IResponseCheckin extends IResponseApi {
  checkinId?: number
  checkin?: ICheckin
  checkins?: ICheckin[]
}

export type CheckinRawDto = {
  userId: string
  subscriptionCategoryId: number
  actived: boolean
  // verified: boolean
  // categoryId: number
  tournamentId: number
  // title: string
  // userUserId: string
  name: string
  nick: string
  email: string
  image: string
  gender: string
  completed: boolean
  checkinId: number
  checkinUserId: string
  check: boolean
  createdAt: Date
}
