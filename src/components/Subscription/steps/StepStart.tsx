import ArrowRightIcon from '@mui/icons-material/ChevronRight'
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'

import { FormSubscriptionStart } from '~/components/forms/UnForm/FormSubscription/start'
import { LogoSvg } from '~/components/LogoSvg'
import { usePassRoll } from '~/components/PassRollLayout'
import { BoxCenter, Text } from '~/components/styled'
import { useUserAuth } from '~/components/UserProvider'

import { CardContainer } from './style'

interface Props {}

export const StepStart: React.FC<Props> = () => {
  const { userData } = useUserAuth()
  const { goTo } = usePassRoll('subscription')

  return (
    <BoxCenter style={{ paddingTop: 12 }}>
      <CardContainer>
        <CardContent>
          <Grid container direction="column" alignItems="center">
            <LogoSvg height={92} />
            <br />
            <div>
              <Text align="center" transform="uppercase">
                Confime as suas informações para prosseguirmos com a inscrição
              </Text>
              <br />
              <br />
              <FormSubscriptionStart />
            </div>
          </Grid>
        </CardContent>
        <CardActions style={{ justifyContent: 'flex-end' }}>
          <Button type="button" variant="contained" onClick={() => goTo(2)} endIcon={<ArrowRightIcon />} disabled={!userData?.cpf}>
            Próximo
          </Button>
        </CardActions>
      </CardContainer>
    </BoxCenter>
  )
}
