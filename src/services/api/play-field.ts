import { NewResponseApi } from '~/server-side/api.interface'
import { CreatePlayFieldDTO } from '~/server-side/useCases/play-field/dto/create-play-field.dto'
import { FilterPlayFieldDTO } from '~/server-side/useCases/play-field/dto/filter-play-field.dto'
import { UpdatePlayFieldDTO } from '~/server-side/useCases/play-field/dto/update-play-field.dto'
import { PlayField } from '~/server-side/useCases/play-field/play-field.entity'

import { apiService } from './api.service'

export async function createPlayField(dto: CreatePlayFieldDTO): Promise<NewResponseApi<PlayField>> {
  const response = await apiService.post(`/play-field`, dto)
  return response
}

export async function updatePlayField(dto: UpdatePlayFieldDTO): Promise<NewResponseApi<any>> {
  const response = await apiService.patch(`/play-field`, dto)
  return response
}

export async function listPlayFieldInArena(arenaId: number, filter: FilterPlayFieldDTO = {}): Promise<NewResponseApi<PlayField[]>> {
  const params = new URLSearchParams(filter as any).toString()
  const query = params ? `?${params}` : ''

  const response = await apiService.get(`/play-field/list/${arenaId}${query}`)
  return response
}

export async function getPlayField(fieldId: number): Promise<NewResponseApi<PlayField>> {
  const response = await apiService.get(`/play-field$/${fieldId}`)
  return response
}
