import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import Button from '@mui/material/Button'
import { useRouter } from 'next/router'

import { CircleLoading } from '~/components/CircleLoading'
import { PixCode } from '~/components/PixCode'
import { FlexContainer, Text } from '~/components/styled'

import { useSubscription } from '../../SubscriptionProvider'

export const Payment: React.FC = () => {
  const { replace } = useRouter()
  const [loading, setLoading] = useState(false)
  const { payment, subscription, generatePixPayment, clearSubscription } = useSubscription()

  const fetchData = useCallback(async () => {
    if (subscription?.id && !payment?.txid) {
      setLoading(true)
      const response = await generatePixPayment(subscription.id)
      setLoading(false)
      if (!response?.success) {
        toast.error(response?.message || 'Erro ao adquirir PIX')
      }
    }
  }, [generatePixPayment, subscription, payment])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleClickHome = () => {
    replace('/')
    clearSubscription()
  }

  return (
    <>
      <FlexContainer justify="center" verticalPad={20}></FlexContainer>
      <PixCode base64QRCode={payment?.imageQrcode} stringQRCode={payment?.qrcode} paymentId={payment?.paymentId} txid={payment?.txid} />
      <br />
      <Button variant="contained" type="button" onClick={handleClickHome}>
        Voltar para página principal
      </Button>
      {loading ? <CircleLoading text="Gerando pagamento pix" /> : null}
    </>
  )
}
