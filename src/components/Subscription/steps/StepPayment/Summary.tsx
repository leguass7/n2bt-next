import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import Button from '@mui/material/Button'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import * as yup from 'yup'

import { CircleLoading } from '~/components/CircleLoading'
import { Input } from '~/components/forms/UnForm/Input'
import { FlexContainer, Text } from '~/components/styled'
import { SubscriptionItem } from '~/components/SubscriptionItem'
import { validateFormData } from '~/helpers/validation'
import type { Subscription } from '~/server-side/useCases/subscriptions/subscriptions.entity'
import { searchPayments } from '~/services/api/payment'
import { searchPromoCode } from '~/services/api/promo-code'
import { findUser } from '~/services/api/user'

import { useSubscription } from '../../SubscriptionProvider'

interface Props {
  noPartner?: boolean
}

interface FormData {
  code: string
}

// TEMP
const schema = yup.object({
  code: yup
    .string()
    .length(8, 'Código inválido')
    .test('code', 'Código inexistente', async value => {
      if (value.length !== 8) return true

      const response = await searchPromoCode({ code: value })
      const promo = response?.promoCode

      return !!promo
    })
    .test('code', 'Código expirado ou já usado', async value => {
      if (value.length !== 8) return true

      const response = await searchPromoCode({ code: value })
      const promo = response?.promoCode

      const session = await getSession()
      const responseUsers = await findUser({ search: session?.user?.email })
      const user = responseUsers?.users?.[0]

      if (!promo?.id) return true

      const responsePayment = await searchPayments({ promoCodeId: promo.id })
      const payments = responsePayment?.payments
      if (!payments?.length) return true

      const expired = !(payments?.length < promo?.usageLimit)
      const usedByUser = payments?.find?.(payment => payment.userId == user?.id)
      return !(expired || usedByUser)
    })
})

export const Summary: React.FC<Props> = () => {
  const [loading, setLoading] = useState(false)
  const { category, partner, saveSubscription, subscription, paymentPayload, setPaymentPayload } = useSubscription()
  const { query } = useRouter()

  const formRef = useRef<FormHandles>(null)
  const initialPromoCode = useMemo(() => query?.promo, [query?.promo])

  const updateForm = useCallback(() => {
    if (initialPromoCode) {
      formRef.current?.setData?.({ code: initialPromoCode })
      formRef.current?.submitForm()
      // setPaymentPayload(old => ({ ...old, promoCode: initialPromoCode as string }))
    }
  }, [initialPromoCode])

  useEffect(() => {
    updateForm()
  }, [updateForm])

  const handleSubmit = async (formData: FormData) => {
    const isInvalid = await validateFormData(schema, formData, formRef.current)
    if (isInvalid) return setPaymentPayload(old => ({ ...old, promoCode: null }))

    const promoCode = formData.code
    setPaymentPayload(old => ({ ...old, promoCode }))
  }

  const handleGenerateClick = async () => {
    if (!subscription?.id) {
      setLoading(true)
      await saveSubscription(!!paymentPayload?.noPartner)
      setLoading(false)
    }
  }

  const data = { ...subscription, category, partner } as Subscription

  return (
    <>
      <FlexContainer justify="center" verticalPad={20}>
        <Text align="center" transform="uppercase">
          <Text align="center">
            Confira sua inscrição e clique <Text bold>GERAR PAGAMENTO</Text>
          </Text>
        </Text>
      </FlexContainer>
      <Text>Tem um cupom de desconto? Digite abaixo</Text>
      <Form ref={formRef} onSubmit={handleSubmit}>
        <Input name="code" onBlur={() => formRef.current?.submitForm()} />
      </Form>
      <br />
      <br />
      <SubscriptionItem disableActions {...data} />
      <FlexContainer justify="center" verticalPad={20} onClick={handleGenerateClick}>
        <Button variant="outlined">GERAR PAGAMENTO</Button>
      </FlexContainer>
      {loading ? <CircleLoading /> : null}
    </>
  )
}
