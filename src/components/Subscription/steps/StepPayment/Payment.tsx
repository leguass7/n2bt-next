import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import Button from '@mui/material/Button'
import { differenceInMinutes } from 'date-fns'
import { useRouter } from 'next/router'

import { useAppTheme } from '~/components/AppThemeProvider/useAppTheme'
import { CircleLoading } from '~/components/CircleLoading'
import { PaymentButton } from '~/components/PaymentButton'
import { PixCode } from '~/components/PixCode'
import { FlexContainer } from '~/components/styled'
import { tryDate } from '~/helpers/dates'
import { type PaymentType } from '~/services/api/payment'

import { useSubscription } from '../../SubscriptionProvider'

interface Props {}

export const Payment: React.FC<Props> = () => {
  const { replace } = useRouter()
  const { theme } = useAppTheme()
  const [loading, setLoading] = useState(false)
  const { payment, subscription, createPayment, clearSubscription, category } = useSubscription()

  const paymentLinkEnabled = useMemo(() => {
    const creditCardEnd = tryDate(category?.tournament?.creditCardEnd as Date)
    return creditCardEnd && differenceInMinutes(creditCardEnd, new Date()) > 0
  }, [category?.tournament?.creditCardEnd])

  const handleClickPayment = useCallback(
    (type: PaymentType) => async () => {
      if (subscription?.id && !payment?.txid) {
        setLoading(true)
        const response = await createPayment(subscription.id, type)
        setLoading(false)
        if (!response?.success) {
          toast.error(response?.message || 'Erro ao adquirir Link de pagamento')
        }
      }
    },
    [createPayment, payment, subscription]
  )

  useEffect(() => {
    if (!paymentLinkEnabled) handleClickPayment('PIX')()
  }, [handleClickPayment, paymentLinkEnabled])

  const handleClickHome = () => {
    replace('/')
    clearSubscription()
  }

  return (
    <>
      <FlexContainer justify="center" verticalPad={20} gap={theme?.spacing?.xl}>
        {paymentLinkEnabled ? (
          <>
            <PaymentButton type="PIX" onClick={handleClickPayment('PIX')} />
            <PaymentButton type="LINK" onClick={handleClickPayment('LINK')} />
          </>
        ) : null}
      </FlexContainer>
      {!loading && payment?.imageQrcode ? (
        <PixCode base64QRCode={payment?.imageQrcode} stringQRCode={payment?.qrcode} paymentId={payment?.paymentId} txid={payment?.txid} />
      ) : null}
      <br />
      <Button variant="contained" type="button" onClick={handleClickHome}>
        Voltar para página principal
      </Button>
      {loading ? <CircleLoading text="Gerando pagamento" /> : null}
    </>
  )
}
