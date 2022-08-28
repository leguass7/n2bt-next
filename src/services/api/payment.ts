// import type { IResponseCheckPayment } from '~/server-side/payment/payment.dto'

import { IResponseGeneratePix } from '~/server-side/useCases/payment/payment.dto'
import { Payment } from '~/server-side/useCases/payment/payment.entity'

import { apiService } from './api.service'

// import { apiService } from './api.service'

export async function createPayment(subscriptionId: number, data: Partial<Payment>): Promise<IResponseGeneratePix> {
  const response = await apiService.post(`/payment/pix/generate?subscriptionId=${subscriptionId}`, { ...data })
  return response
}

export async function generatePayment(subscriptionId: number): Promise<IResponseGeneratePix> {
  const response = await apiService.get(`/payment/generate/${subscriptionId}`)
  return response
}

type Payload = { disableqrcode?: boolean; fetchId: number }
export async function checkPayment(paymentId: number, { fetchId, disableqrcode }: Payload): Promise<IResponseGeneratePix> {
  const response = await apiService.post(`/payment/check/${paymentId}`, { fetchId, disableqrcode }, { params: { fetchId } })
  return response
}
