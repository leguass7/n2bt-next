import { PlayFieldFormData } from '~/components/admin/PlayFields/PlayFieldForm'
import { NewResponseApi } from '~/server-side/api.interface'
import { FilterPlayFieldDTO } from '~/server-side/useCases/play-field/dto/filter-play-field.dto'
import { UpdatePlayFieldDTO } from '~/server-side/useCases/play-field/dto/update-play-field.dto'
import { PlayField } from '~/server-side/useCases/play-field/play-field.entity'

import { apiService } from './api.service'

export async function createPlayField(dto: PlayFieldFormData): Promise<NewResponseApi<PlayField>> {
  const response = await apiService.post(`/play-field`, dto)
  return response
}

export async function updatePlayField(fieldId: number, dto: UpdatePlayFieldDTO): Promise<NewResponseApi<any>> {
  const response = await apiService.patch(`/play-field/${fieldId}`, dto)
  return response
}

export async function listPlayFieldInArena(arenaId: number, filter: FilterPlayFieldDTO = {}): Promise<NewResponseApi<PlayField[]>> {
  const params = new URLSearchParams(filter as any).toString()
  const query = params ? `?${params}` : ''

  const response = await apiService.get(`/play-field/list/${arenaId}${query}`)
  return response
}

export async function getPlayField(fieldId: number): Promise<NewResponseApi<PlayField>> {
  const response = await apiService.get(`/play-field/${fieldId}`)
  return response
}
