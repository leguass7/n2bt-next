import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Link from 'next/link'

import { FormSignup } from '~/components/forms/UnForm/FormSignup'
import { usePassRoll } from '~/components/PassRollLayout'
import { BoxCenter, FlexContainer, Text } from '~/components/styled'
import { LogoSvg } from '~/components/svg/LogoSvg'

interface Props {}

export const StepSignup: React.FC<Props> = () => {
  const { goTo } = usePassRoll('signIn')

  return (
    <div style={{ height: '100%' }}>
      <BoxCenter>
        <Card sx={{ width: 400, maxWidth: '100%', ml: 1, mr: 1 }}>
          <FlexContainer justify="center" verticalPad={8}>
            <LogoSvg height={72} />
          </FlexContainer>
          <Divider />
          <CardContent>
            <FormSignup onCancel={() => goTo(1)} />
          </CardContent>
          <CardActions>
            <FlexContainer justify="center">
              <Text textSize={14} verticalPad={10}>
                <Link href={'/'}>página principal</Link>
              </Text>
            </FlexContainer>
          </CardActions>
        </Card>
      </BoxCenter>
    </div>
  )
}
