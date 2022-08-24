import React from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'

import { usePassRoll } from '~/components/PassRollLayout'
import { BoxCenter, FlexContainer } from '~/components/styled'

import { FormForgot } from '../forms/UnForm/FormForgot'
import { LogoSvg } from '../LogoSvg'

export const StepForgot: React.FC = () => {
  const { goTo } = usePassRoll('signIn')

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
            <FormForgot onCancel={() => goTo(1)} />
          </CardContent>
        </Card>
      </FlexContainer>
    </BoxCenter>
  )
}
