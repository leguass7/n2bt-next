import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import ArrowLeftIcon from '@mui/icons-material/ChevronLeft'
// import ArrowRightIcon from '@mui/icons-material/ChevronRight'
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import { useRouter } from 'next/router'

import { LogoSvg } from '~/components/LogoSvg'
import { BoxCenter, Text } from '~/components/styled'

import { useSubscription } from '../SubscriptionProvider'
import { CardContainer } from './style'

interface Props {}

export const StepPayment: React.FC<Props> = () => {
  const { category } = useSubscription()
  const { push } = useRouter()

  return (
    <BoxCenter style={{ paddingTop: 12 }}>
      <CardContainer>
        <CardContent>
          <Grid container direction="column" alignItems="center">
            <LogoSvg height={92} />
            <br />
            <Text align="center" transform="uppercase">
              Pagamento
            </Text>
            <Text>{category?.title}</Text>
          </Grid>
        </CardContent>
        <CardActions style={{ justifyContent: 'flex-end' }}>
          <Button type="button" variant="contained" onClick={() => push('/')}>
            Sair
          </Button>
          {/* <Button type="button" variant="contained" onClick={() => goTo(3)} endIcon={<ArrowRightIcon />}>
            Próximo
          </Button> */}
        </CardActions>
      </CardContainer>
    </BoxCenter>
  )
}
