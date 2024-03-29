import React, { useCallback, useEffect } from 'react'

import ArrowLeftIcon from '@mui/icons-material/ChevronLeft'
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'

import { usePassRoll } from '~/components/PassRollLayout'
import { BoxCenter } from '~/components/styled'
import { CardContainer } from '~/styles'

import { useSubscription } from '../../SubscriptionProvider'
import { Payment } from './Payment'
import { Summary } from './Summary'

interface Props {
  icon: React.ReactNode
  noPartner?: boolean
}

export const StepPayment: React.FC<Props> = ({ icon, noPartner }) => {
  const { goTo } = usePassRoll('subscription')
  const { subscription, setPaymentPayload } = useSubscription()

  const handleBack = () => goTo(noPartner ? 2 : 3)

  const updatePaymentPayload = useCallback(() => {
    setPaymentPayload({ noPartner })
  }, [setPaymentPayload, noPartner])

  useEffect(() => {
    updatePaymentPayload()
  }, [updatePaymentPayload])

  return (
    <BoxCenter style={{ paddingTop: 12, minHeight: '50vh' }}>
      <CardContainer>
        <CardHeader title="Pagamento" subheader="Siga as instruções abaixo para pagamento da inscrição" avatar={icon} />
        <Divider />
        <CardContent>
          <Grid container direction="column" alignItems="center" sx={{ width: '100%' }}>
            {subscription?.id ? <Payment /> : <Summary noPartner={noPartner} />}
          </Grid>
        </CardContent>
        <Divider />
        <CardActions style={{ justifyContent: 'flex-end' }}>
          <Button type="button" variant="contained" onClick={handleBack} startIcon={<ArrowLeftIcon />} disabled={!!subscription?.id}>
            Voltar
          </Button>
        </CardActions>
      </CardContainer>
    </BoxCenter>
  )
}
