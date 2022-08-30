import ArrowRightIcon from '@mui/icons-material/ChevronRight'
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'

import { FormSubscriptionStart } from '~/components/forms/UnForm/FormSubscription/start'
import { usePassRoll } from '~/components/PassRollLayout'
import { BoxCenter } from '~/components/styled'
import { useUserAuth } from '~/components/UserProvider'
import { CardContainer } from '~/styles'

interface Props {
  icon: React.ReactNode
}

export const StepStart: React.FC<Props> = ({ icon }) => {
  const { userData } = useUserAuth()
  const { goTo } = usePassRoll('subscription')

  return (
    <BoxCenter style={{ paddingTop: 12 }}>
      <CardContainer>
        <CardHeader title="Cadastro" subheader="Confime as suas informações para prosseguirmos com a inscrição" avatar={icon} />
        <Divider />
        <CardContent>
          <Grid container direction="column" alignItems="center">
            <div>
              <FormSubscriptionStart />
            </div>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions style={{ justifyContent: 'flex-end' }}>
          <Button type="button" variant="contained" onClick={() => goTo(2)} endIcon={<ArrowRightIcon />} disabled={!userData?.cpf}>
            Próximo
          </Button>
        </CardActions>
      </CardContainer>
    </BoxCenter>
  )
}
