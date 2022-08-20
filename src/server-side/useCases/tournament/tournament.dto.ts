import type { DeepPartial } from 'typeorm'

import type { IResponseApi } from '~/server-side/api.interface'

import { Tournament } from './tournament.entity'

export type ITournament = DeepPartial<Tournament>

export interface IResponseTournament extends IResponseApi {
  tournament: ITournament
  tournamentId: number
}

export interface IResponseTournaments extends IResponseApi {
  tournaments: ITournament[]
}
