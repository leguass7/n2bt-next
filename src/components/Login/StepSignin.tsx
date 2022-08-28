import React from 'react'

import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Link from 'next/link'

import { FormSignin } from '~/components/forms/UnForm/FormSignin'
import { usePassRoll } from '~/components/PassRollLayout'
import { BoxCenter, FlexContainer, Text } from '~/components/styled'
import { LogoSvg } from '~/components/svg/LogoSvg'

import type { CustomContextSigin } from './custom.types'

interface Props {
  allowRegister?: boolean
}

export const StepSignin: React.FC<Props> = ({ allowRegister = false }) => {
  const { goTo } = usePassRoll<CustomContextSigin>('signIn')

  return (
    <BoxCenter>
      <Card>
        <FlexContainer justify="center" verticalPad={8}>
          <LogoSvg height={72} />
        </FlexContainer>
        <Divider />
        <CardContent>
          <FormSignin onRegister={allowRegister ? () => goTo(4) : null} onForgot={() => goTo(2)} />
        </CardContent>
        <Divider />
        <CardActions>
          <FlexContainer justify="center">
            <Text textSize={14} verticalPad={10}>
              <Link href={'/'}>página principal</Link>
            </Text>
          </FlexContainer>
        </CardActions>
      </Card>
    </BoxCenter>
  )
}
