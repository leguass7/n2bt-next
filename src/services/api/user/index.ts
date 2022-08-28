import type { TableFetchParams } from '~/components/CustomTable/types'
import type { IResponsePaginated } from '~/server-side/services/PaginateService'
import type { IResponseUsers, IResponseUserStore, IUser } from '~/server-side/useCases/user/user.dto'

import { apiService } from '../api.service'

export async function saveMe(data: IUser): Promise<IResponseUserStore> {
  const response = await apiService.patch('/user', data)
  return response
}

export async function createUser(data: IUser): Promise<IResponseUserStore> {
  const response = await apiService.post('/user/register', data)
  return response
}

export async function paginateUsers(params: TableFetchParams = {}): Promise<IResponsePaginated<IUser>> {
  const response = await apiService.get('/user', { params })
  return response
}

export async function findUser(params: any = {}): Promise<IResponseUsers> {
  const response = await apiService.get('/user/find', { params })
  return response
}
