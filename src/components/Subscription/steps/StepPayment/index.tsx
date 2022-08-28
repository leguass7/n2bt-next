import React from 'react'

import ArrowLeftIcon from '@mui/icons-material/ChevronLeft'
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'

import { LogoSvg } from '~/components/LogoSvg'
import { usePassRoll } from '~/components/PassRollLayout'
import { BoxCenter } from '~/components/styled'

import { useSubscription } from '../../SubscriptionProvider'
import { CardContainer } from '../style'
import { Payment } from './Payment'
import { Summary } from './Summary'

interface Props {}

export const StepPayment: React.FC<Props> = () => {
  const { goTo } = usePassRoll('subscription')
  const { subscription } = useSubscription()

  return (
    <BoxCenter style={{ paddingTop: 12, minHeight: '50vh' }}>
      <CardContainer>
        <CardContent>
          <Grid container direction="column" alignItems="center" sx={{ width: '100%' }}>
            <LogoSvg height={92} />
            {subscription?.id ? <Payment /> : <Summary />}
          </Grid>
        </CardContent>
        <CardActions style={{ justifyContent: 'flex-end' }}>
          <Button type="button" variant="contained" onClick={() => goTo(3)} startIcon={<ArrowLeftIcon />} disabled={!!subscription?.id}>
            Voltar
          </Button>
          {/* <Button type="button" variant="contained" onClick={() => push('/')}>
            Sair
          </Button> */}
        </CardActions>
      </CardContainer>
    </BoxCenter>
  )
}
