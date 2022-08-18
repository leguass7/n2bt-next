import React from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

import { FormSignin } from '~/components/forms/UnForm/FormSignin'
import { usePassRoll } from '~/components/PassRollLayout'
import { BoxCenter, FlexContainer } from '~/components/styled'

export const StepSigin: React.FC = () => {
  const { goTo } = usePassRoll('sigin')

  return (
    <BoxCenter>
      <FlexContainer justify="center">{/* <LogoSteps layoutName={layoutName} /> */}</FlexContainer>
      <FlexContainer justify="center">
        <Card>
          <CardContent>
            <FormSignin onForgot={() => goTo(2)} />
          </CardContent>
        </Card>
      </FlexContainer>
    </BoxCenter>
  )
}
