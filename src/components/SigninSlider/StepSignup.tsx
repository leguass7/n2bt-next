import { Card, CardContent, Divider } from '@mui/material'
import Link from 'next/link'

import { FormSignup } from '../forms/UnForm/FormSignup'
import { LogoSvg } from '../LogoSvg'
import { usePassRoll } from '../PassRollLayout'
import { BoxCenter, FlexContainer, Text } from '../styled'

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
