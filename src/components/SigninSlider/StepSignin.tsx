import React from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Link from 'next/link'

import { FormSignin } from '~/components/forms/UnForm/FormSignin'
import { usePassRoll } from '~/components/PassRollLayout'
import { BoxCenter, FlexContainer, Text } from '~/components/styled'

import { LogoSvg } from '../LogoSvg'

export const StepSignin: React.FC = () => {
  const { goTo } = usePassRoll('signIn')

  return (
    <BoxCenter>
      <FlexContainer justify="center">
        <Card>
          <CardContent>
            <FlexContainer justify="center">
              <LogoSvg height={92} />
            </FlexContainer>
            <Divider sx={{ mt: 2, mb: 1 }} />
            <FormSignin onRegister={() => goTo(4)} onForgot={() => goTo(2)} />
          </CardContent>
        </Card>
      </FlexContainer>
      <FlexContainer justify="center">
        <Text textSize={14} verticalPad={10}>
          <Link href={'/'}>página principal</Link>
        </Text>
      </FlexContainer>
    </BoxCenter>
  )
}
