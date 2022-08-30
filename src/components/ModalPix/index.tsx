import React, { useCallback, useEffect, useRef, useState } from 'react'

import Card from '@mui/material/Card'
import Modal from '@mui/material/Modal'

import type { IResponseGeneratePix } from '~/server-side/useCases/payment/payment.dto'
import { checkPayment } from '~/services/api/payment'
import { CardContainer } from '~/styles'

import { PixCode } from '../PixCode'
import { BoxCenter } from '../styled'

export type ModalPixCloseHandler = (event?: React.SyntheticEvent<any>, reason?: 'backdropClick' | 'escapeKeyDown') => void
type Props = {
  paymentId?: number
  onClose: ModalPixCloseHandler
}
export const ModalPix: React.FC<Props> = ({ paymentId, onClose }) => {
  const refId = useRef(0)
  const [data, setData] = useState<IResponseGeneratePix>()

  const fetchData = useCallback(async () => {
    if (paymentId) {
      refId.current += 1
      const response = await checkPayment(paymentId, { disableqrcode: false, fetchId: refId.current })
      if (response?.success) {
        setData({ ...response })
      }
    }
  }, [paymentId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <Modal open={!!(paymentId > 0)} onClose={onClose} keepMounted={false}>
      <BoxCenter>
        <Card sx={{ m: 1 }}>
          <CardContainer>
            <PixCode
              fetchId={refId.current}
              base64QRCode={data?.imageQrcode}
              paymentId={paymentId}
              stringQRCode={data?.qrcode}
              txid={data?.txid}
              onClose={() => onClose && onClose()}
            />
          </CardContainer>
        </Card>
      </BoxCenter>
    </Modal>
  )
}
