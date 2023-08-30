import type { DeepPartial } from 'typeorm'

import type { IResponseApi } from '~/server-side/api.interface'

import { type Ranking } from './ranking.entity'

export type IRanking = DeepPartial<Ranking>

export interface IResponseRanking extends IResponseApi {
  ranking: IRanking
  rankingId: number
  rankingIds: number[]
}

export interface IResponseRankings extends IResponseApi {
  rankings: IRanking[]
}

export interface IResponseUserRanking extends IResponseApi {
  rankings: IRanking[]
}
