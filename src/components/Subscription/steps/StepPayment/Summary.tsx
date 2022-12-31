import React, { useState } from 'react'

import Button from '@mui/material/Button'

import { CircleLoading } from '~/components/CircleLoading'
import { FlexContainer, Text } from '~/components/styled'
import { SubscriptionItem } from '~/components/SubscriptionItem'
import type { Subscription } from '~/server-side/useCases/subscriptions/subscriptions.entity'

import { useSubscription } from '../../SubscriptionProvider'

interface Props {
  noPartner?: boolean
}

export const Summary: React.FC<Props> = ({ noPartner = false }) => {
  const [loading, setLoading] = useState(false)
  const { category, partner, saveSubscription, subscription } = useSubscription()

  const handleGenerateClick = async () => {
    if (!subscription?.id) {
      setLoading(true)
      await saveSubscription(noPartner)
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
