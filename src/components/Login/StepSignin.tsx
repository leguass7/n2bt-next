import React, { useCallback, useEffect } from 'react'

import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Image from 'next/image'
import Link from 'next/link'

import { FormSignin } from '~/components/forms/UnForm/FormSignin'
import { usePassRoll } from '~/components/PassRollLayout'
import { BoxCenter, FlexContainer, Text } from '~/components/styled'
import { useAppRecoverCode } from '~/hooks/useAppAuth'

import type { CustomContextSigin } from './custom.types'
import { ExternalLogin } from './ExternalLogin'

interface Props {
  allowRegister?: boolean
}

export const StepSignin: React.FC<Props> = ({ allowRegister = false }) => {
  const [recoverCode] = useAppRecoverCode()
  const { goTo, customContext } = usePassRoll<CustomContextSigin>('signIn')

  useEffect(() => {
    if (recoverCode && !customContext?.privateCode) {
      goTo(3, { privateCode: recoverCode })
    }
  }, [recoverCode, goTo, customContext])

  const handleForgot = useCallback(() => {
    if (recoverCode) goTo(3, { privateCode: recoverCode })
    else goTo(2, { privateCode: '' })
  }, [recoverCode, goTo])

  return (
    <BoxCenter>
      <Card>
        <FlexContainer justify="center" verticalPad={8}>
          <Image height={150} width={150} layout="fixed" src="/logo.svg" alt="Logo" />
          {/* <LogoSvg height={72} /> */}
        </FlexContainer>
        <Divider />
        <CardContent>
          <FormSignin onRegister={allowRegister ? () => goTo(4) : null} onForgot={handleForgot} />
          <ExternalLogin />
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
