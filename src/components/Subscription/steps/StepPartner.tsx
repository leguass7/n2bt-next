import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'

import ArrowLeftIcon from '@mui/icons-material/ChevronLeft'
import ArrowRightIcon from '@mui/icons-material/ChevronRight'
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'

import { CircleLoading } from '~/components/CircleLoading'
import { LogoSvg } from '~/components/LogoSvg'
import { usePassRoll } from '~/components/PassRollLayout'
import { BoxCenter, Text } from '~/components/styled'
import { DeletePatnerHandler, SelectPatner, SelectPatnerHandler } from '~/components/User/SelectPartner'
import { useIsMounted } from '~/hooks/useIsMounted'

import { useSubscription } from '../SubscriptionProvider'
import { CardContainer } from './style'

interface Props {}

export const StepPartner: React.FC<Props> = () => {
  const { partner, setPartner, tournamentId, category, savePayment } = useSubscription()
  const { goTo } = usePassRoll('subscription')

  const [loading, setLoading] = useState(false)
  const isMounted = useIsMounted()

  const handleChange: SelectPatnerHandler = useCallback(
    user => {
      setPartner(user)
    },
    [setPartner]
  )

  const handlePayment = useCallback(async () => {
    if (!partner) return null
    setLoading(true)

    const response = await savePayment()
    if (!response) return null

    const { success = false, message } = response

    if (isMounted()) {
      setLoading(false)
      if (!success) {
        toast.error(message)
        return null
      }

      console.log(response)
    }
  }, [isMounted, savePayment, partner])

  const handleNext = useCallback(() => {
    handlePayment()
    goTo(4)
  }, [handlePayment, goTo])

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
          <Button type="button" variant="contained" onClick={handleNext} endIcon={<ArrowRightIcon />} disabled={!partner}>
            Próximo
          </Button>
        </CardActions>
      </CardContainer>
      {loading ? <CircleLoading /> : null}
    </BoxCenter>
  )
}
