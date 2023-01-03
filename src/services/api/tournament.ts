import type { TableFetchParams } from '~/components/CustomTable/types'
import type { IResponsePaginated } from '~/server-side/services/PaginateService'
import type { IResponseTournament, IResponseTournaments, ITournament } from '~/server-side/useCases/tournament/tournament.dto'
import { apiService } from '~/services/api/api.service'

export async function listTournaments(params: TableFetchParams = {}): Promise<IResponseTournaments> {
  const response = await apiService.get(`/tournament/list`, { params })
  return response
}

export async function paginateTournaments(arenaId?: number, params: TableFetchParams = {}): Promise<IResponsePaginated<ITournament>> {
  const response = await apiService.get(`/tournament?arenaId=${arenaId}`, { params })
  return response
}

export async function getTournament(tournamentId: number): Promise<IResponseTournament> {
  const response = await apiService.get(`/tournament/${tournamentId}`)
  return response
}

export async function updateTournament(tournamentId: number, data: Partial<ITournament>): Promise<IResponseTournament> {
  const response = await apiService.patch(`/tournament/${tournamentId}`, data)
  return response
}

export async function createTournament(data: Partial<ITournament>): Promise<IResponseTournament> {
  const response = await apiService.post(`/tournament`, data)
  return response
}

export async function storeTournament({ id, ...data }: Partial<ITournament>): Promise<IResponseTournament> {
  const handler = () => {
    if (id && id > 0) return updateTournament(id, data)
    return createTournament(data)
  }
  const response = await handler()
  return response
}

export async function deletetTournament(tournamentId: number): Promise<IResponseTournament> {
  const response = await apiService.delete(`/tournament/${tournamentId}`)
  return response
}

// upload image
