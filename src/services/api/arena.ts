import type { IResponsePaginated, QueryPagination } from '~/server-side/api.interface'
import type { IResponseArena, IResponseArenas } from '~/server-side/useCases/arena/arena.dto'
import { apiService } from '~/services/api/api.service'

export async function getArena(arenaId: number): Promise<IResponseArena> {
  const response = await apiService.get(`/arena/${arenaId}`)
  return response
}

export async function listArenas(): Promise<IResponseArenas> {
  const response = await apiService.get(`/arena/list`)
  return response
}

export async function paginateArenas(params: QueryPagination = {}): Promise<IResponsePaginated<any>> {
  const response = await apiService.get(`/arena/list`, { params })
  return response
}
