import type { DeepPartial } from 'typeorm'

import type { IResponseApi } from '~/server-side/api.interface'

import { Checkin } from './checkin.entity'

export type ICheckin = DeepPartial<Checkin>

export interface IResponseCheckin extends IResponseApi {
  checkinId?: number
  checkin?: ICheckin
  checkins?: ICheckin[]
}
