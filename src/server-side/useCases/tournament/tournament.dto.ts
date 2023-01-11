// import type { DeepPartial } from 'typeorm'

import type { IResponseApi } from '~/server-side/api.interface'

import { Tournament } from './tournament.entity'

export type ITournament = Partial<Tournament>

export interface IResponseTournament extends IResponseApi {
  tournament: ITournament
  tournamentId: number
}

export interface IResponseTournaments extends IResponseApi {
  tournaments: ITournament[]
}

export enum TournamentModality {
  BEACH_TENNIS = 'BEACH_TENNIS',
  BEACH_VOLEI = 'BEACH_VOLEI',
  BEACH_VOLEI_WITH_PARTNER = 'BEACH_VOLEI_WITH_PARTNER',
  FUTVOLEI = 'FUTVOLEI'
}
