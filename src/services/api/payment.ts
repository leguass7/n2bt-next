import { SearchPaymentDto } from '~/pages/api/payment/search-payment.dto'
import type { IResponseGeneratePix, IResponsePayments } from '~/server-side/useCases/payment/payment.dto'
import { Payment } from '~/server-side/useCases/payment/payment.entity'

import { apiService } from './api.service'

export interface PaymentPayload {
  noPartner?: boolean
  promoCode?: string
}

export async function createPayment(subscriptionId: number, data: Partial<Payment>): Promise<IResponseGeneratePix> {
  const response = await apiService.post(`/payment/pix/generate?subscriptionId=${subscriptionId}`, { ...data })
  return response
}

export async function generatePayment(subscriptionId: number, payload?: PaymentPayload): Promise<IResponseGeneratePix> {
  const params = new URLSearchParams(payload as any)
  const query = params ? `?${params}` : ''
  const response = await apiService.get(`/payment/generate/${subscriptionId}${query}`)
  return response
}

export async function searchPayments(filter: SearchPaymentDto): Promise<IResponsePayments> {
  const params = new URLSearchParams(filter as any)
  const query = params ? `?${params}` : ''
  const response = await apiService.get(`/payment/search${query}`)
  return response
}

type Payload = { disableqrcode?: boolean; fetchId: number }
export async function checkPayment(paymentId: number, { fetchId, disableqrcode }: Payload): Promise<IResponseGeneratePix> {
  const response = await apiService.post(`/payment/check/${paymentId}`, { fetchId, disableqrcode }, { params: { fetchId } })
  return response
}

export interface IRequestManualPayment {
  e2eId: string
}

export async function adminManualPayment(paymentId: number, data?: IRequestManualPayment): Promise<IResponseGeneratePix> {
  const response = await apiService.post(`/payment/${paymentId}`, data)
  return response
}
