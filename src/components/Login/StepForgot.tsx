import React from 'react'
import { toast } from 'react-toastify'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import { useUserAgent } from 'next-useragent'

import { usePassRoll } from '~/components/PassRollLayout'
import { BoxCenter, FlexContainer } from '~/components/styled'

import { FormForgot } from '../forms/UnForm/FormForgot'
import { LogoSvg } from '../LogoSvg'
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
      <FlexContainer justify="center">{/* <LogoSteps layoutName={layoutName} /> */}</FlexContainer>
      <FlexContainer justify="center">
        <Card>
          <CardContent>
            <FlexContainer justify="center">
              <LogoSvg height={92} />
            </FlexContainer>
            <Divider sx={{ mt: 2, mb: 1 }} />
            <FormForgot onCancel={() => goTo(1)} onSuccess={handleSuccess} isWhatsapp={!!isWhatsapp} />
          </CardContent>
        </Card>
      </FlexContainer>
    </BoxCenter>
  )
}
