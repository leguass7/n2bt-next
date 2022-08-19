import type { DeepPartial } from 'typeorm'

import type { IResponseApi } from '~/server-side/api.interface'

import { Arena } from './arena.entity'

export type IArena = DeepPartial<Arena>

export interface IResponseArena extends IResponseApi {
  arena: IArena
  arenaId: number
}

export interface IResponseArenas extends IResponseApi {
  arenas: IArena[]
}
