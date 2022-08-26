import ArrowLeftIcon from '@mui/icons-material/ChevronLeft'
import ArrowRightIcon from '@mui/icons-material/ChevronRight'
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'

import { LogoSvg } from '~/components/LogoSvg'
import { usePassRoll } from '~/components/PassRollLayout'
import { SelectCategory, CategoryChangeHandler } from '~/components/SelectCategory'
import { BoxCenter, Text } from '~/components/styled'
import { useSubscription } from '~/components/Subscription/SubscriptionProvider'

import { CardContainer } from './style'

interface Props {}

export const StepCategory: React.FC<Props> = () => {
  const { tournamentId, setCategory, category } = useSubscription()
  const { goTo } = usePassRoll('subscription')

  const handleChange: CategoryChangeHandler = (id, cat) => {
    if (id) setCategory(cat)
  }

  return (
    <BoxCenter style={{ paddingTop: 12 }}>
      <CardContainer>
        <CardContent>
          <Grid container direction="column" alignItems="center">
            <LogoSvg height={92} />
            <br />
            <Text align="center" transform="uppercase">
              Selecione a categoria desejada
            </Text>
            <SelectCategory tournamentId={tournamentId} onChange={handleChange} defaultSelected={category?.id} />
          </Grid>
        </CardContent>
        <CardActions style={{ justifyContent: 'flex-end' }}>
          <Button type="button" variant="contained" onClick={() => goTo(1)} startIcon={<ArrowLeftIcon />}>
            Voltar
          </Button>
          <Button type="button" variant="contained" onClick={() => goTo(3)} endIcon={<ArrowRightIcon />} disabled={!category}>
            Próximo
          </Button>
        </CardActions>
      </CardContainer>
    </BoxCenter>
  )
}
