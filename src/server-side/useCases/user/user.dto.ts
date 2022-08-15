import type { DeepPartial } from 'typeorm'

import type { IResponseApi } from '~/server-side/api.interface'

import type { User } from './user.entity'

export type IUser = DeepPartial<User>

export interface IResponseUserStore extends IResponseApi {
  createdId?: string
  userId?: string
  completed?: boolean
}

export interface IResponseCheckUser extends IResponseApi {
  user?: Partial<User>
}

export interface IResponseUser extends IResponseApi {
  user?: IUser
}

export interface IResponseUsers extends IResponseApi {
  users?: IUser[]
}
