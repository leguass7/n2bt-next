import ArrowLeftIcon from '@mui/icons-material/ChevronLeft'
import ArrowRightIcon from '@mui/icons-material/ChevronRight'
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'

import { usePassRoll } from '~/components/PassRollLayout'
import { BoxCenter } from '~/components/styled'
import { SelectCategory, type CategoryChangeHandler } from '~/components/Subscription/steps/StepCategory/SelectCategory'
import { useSubscription } from '~/components/Subscription/SubscriptionProvider'
import { CardContainer } from '~/styles'

interface Props {
  icon: React.ReactNode
}

export const StepCategory: React.FC<Props> = ({ icon }) => {
  const { tournamentId, setCategory, category, maxSubscription } = useSubscription()
  const { goTo } = usePassRoll('subscription')

  const handleChange: CategoryChangeHandler = (id, cat) => {
    if (id) setCategory(cat)
  }

  return (
    <BoxCenter style={{ paddingTop: 12 }}>
      <CardContainer>
        <CardHeader title={'Categoria'} subheader={'Selecione a categoria desejada'} avatar={icon} />
        <Divider />
        <CardContent>
          <Grid container direction="column" alignItems="center">
            <SelectCategory maxSubscription={maxSubscription} tournamentId={tournamentId} onChange={handleChange} defaultSelected={category?.id} />
          </Grid>
        </CardContent>
        <Divider />
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
