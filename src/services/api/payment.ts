// import type { IResponseCheckPayment } from '~/server-side/payment/payment.dto'

import { IResponseGeneratePix } from '~/server-side/useCases/payment/payment.dto'
import { Payment } from '~/server-side/useCases/payment/payment.entity'

import { apiService } from './api.service'

// import { apiService } from './api.service'

export async function createPayment(subscriptionId: string, data: Partial<Payment>): Promise<IResponseGeneratePix> {
  const response = await apiService.post(`/payment/pix/generate?subscriptionId=${subscriptionId}`, { ...data })
  return response
}

// export async function checkPayment(paymentId: number): Promise<IResponseCheckPayment> {
//   const response = await apiService.get(`/payment/${paymentId}`)
//   return response
// }
