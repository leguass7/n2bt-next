import React from 'react'
import { toast } from 'react-toastify'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import { useUserAgent } from 'next-useragent'

import { FormForgot } from '~/components/forms/UnForm/FormForgot'
import { usePassRoll } from '~/components/PassRollLayout'
import { BoxCenter, FlexContainer } from '~/components/styled'
import { LogoSvg } from '~/components/svg/LogoSvg'

import type { CustomContextSigin } from './custom.types'

type Props = { uaString?: string }
export const StepForgot: React.FC<Props> = ({ uaString }) => {
  const ua = useUserAgent(uaString)
  const { goTo } = usePassRoll<CustomContextSigin>('signIn')

  const isWhatsapp = !!ua?.source?.toLocaleLowerCase()?.match('whatsapp')

  const handleSuccess = (privateCode: string) => {
    if (privateCode) goTo(3, { privateCode })
    else toast.error('Problemas com o código de ativação')
  }
  return (
    <BoxCenter>
      <Card>
        <FlexContainer justify="center" verticalPad={8}>
          <LogoSvg height={72} />
        </FlexContainer>
        <Divider />
        <CardContent>
          <FormForgot onCancel={() => goTo(1)} onSuccess={handleSuccess} isWhatsapp={!!isWhatsapp} />
        </CardContent>
      </Card>
    </BoxCenter>
  )
}
