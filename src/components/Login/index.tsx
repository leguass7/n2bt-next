import React from 'react'

import { ThemeName } from '~/components/AppThemeProvider/themes'

import { Main, SliderItem } from '../PassRollLayout'
import { FlexContainer, Text } from '../styled'
import { StepCode } from './StepCode'
import { StepForgot } from './StepForgot'
import { StepSignin } from './StepSignin'
import { StepSignup } from './StepSignup'

type Props = {
  layoutName?: ThemeName
  reCAPTCHAKey?: string
  uaString?: string
}

const allowRegister = true

export const SigninSlider: React.FC<Props> = ({ uaString }) => {
  return (
    <div>
      <Main name="signIn">
        <SliderItem>
          <StepSignin allowRegister={allowRegister} />
        </SliderItem>
        <SliderItem>
          <StepForgot uaString={uaString} />
        </SliderItem>
        <SliderItem>
          <StepCode />
        </SliderItem>
        {allowRegister ? (
          <SliderItem>
            <StepSignup />
          </SliderItem>
        ) : null}
      </Main>
      <FlexContainer direction="row" justify="center">
        <Text align="center" textColor="#000">
          Avatar Soluções Digitais CNPJ: 26.370.490/0001-01
        </Text>
      </FlexContainer>
    </div>
  )
}
