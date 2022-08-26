import { useCallback } from 'react'

import ArrowLeftIcon from '@mui/icons-material/ChevronLeft'
import ArrowRightIcon from '@mui/icons-material/ChevronRight'
import { Button, CardActions, CardContent, Grid } from '@mui/material'

import { LogoSvg } from '~/components/LogoSvg'
import { usePassRoll } from '~/components/PassRollLayout'
import { BoxCenter, Text } from '~/components/styled'
import { DeletePatnerHandler, SelectPatner, SelectPatnerHandler } from '~/components/User/SelectPartner'

import { useSubscription } from '../SubscriptionProvider'
import { CardContainer } from './style'

interface Props {}

export const StepPartner: React.FC<Props> = () => {
  const { partner, setPartner, tournamentId, category } = useSubscription()
  const { goTo } = usePassRoll('subscription')

  const handleChange: SelectPatnerHandler = useCallback(
    user => {
      setPartner(user)
    },
    [setPartner]
  )

  const handleDelete: DeletePatnerHandler = useCallback(() => {
    setPartner(null)
  }, [setPartner])

  return (
    <BoxCenter style={{ paddingTop: 12 }}>
      <CardContainer>
        <CardContent sx={{ minHeight: 340 }}>
          <Grid container direction="column" alignItems="center">
            <LogoSvg height={92} />
            <br />
            <Text align="center" transform="uppercase">
              Selecione sua dupla
            </Text>
            <SelectPatner
              defaultPartner={partner}
              onChange={handleChange}
              onDelete={handleDelete}
              tournamentId={tournamentId}
              categoryId={category?.id}
            />
          </Grid>
        </CardContent>
        <CardActions style={{ justifyContent: 'flex-end' }}>
          <Button type="button" variant="contained" onClick={() => goTo(2)} startIcon={<ArrowLeftIcon />}>
            Anterior
          </Button>
          <Button type="button" variant="contained" onClick={() => goTo(4)} endIcon={<ArrowRightIcon />} disabled={!partner}>
            Próximo
          </Button>
        </CardActions>
      </CardContainer>
    </BoxCenter>
  )
}
