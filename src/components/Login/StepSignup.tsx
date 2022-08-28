import Card from '@mui/material/Card'
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
        <FlexContainer justify="center">
          <Card>
            <CardContent>
              <FlexContainer justify="center">
                <LogoSvg height={92} />
              </FlexContainer>
              <Divider sx={{ mt: 2, mb: 1 }} />
              <FormSignup onCancel={() => goTo(1)} />
            </CardContent>
          </Card>
        </FlexContainer>
        <FlexContainer justify="center">
          <Text textSize={14} verticalPad={10}>
            <Link href={'/'}>página principal</Link>
          </Text>
        </FlexContainer>
      </BoxCenter>
    </div>
  )
}
