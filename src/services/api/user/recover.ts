import type { IResponseApi } from '~/server-side/api.interface'

import { apiService } from '../api.service'

export type ResponseAuthorization = {
  userId?: string
  authorization: string
}

export type Authorization = ResponseAuthorization & {
  password: string
}

export type PayloadCode = {
  userCode: string
  privateCode: string
}

export async function sendForgot(email?: string): Promise<IResponseApi & { code: string }> {
  const response = await apiService.post('/user/forgot', { email })
  return response
}

export async function sendCode(data: PayloadCode): Promise<IResponseApi & ResponseAuthorization> {
  const response = await apiService.post('/user/code', data)
  return response
}

export async function sendRecover(data: Authorization): Promise<IResponseApi> {
  const response = await apiService.post('/user/reset', data)
  return response
}
