import React from 'react'

import { ThemeName } from '~/components/AppThemeProvider/themes'

import { Main, SliderItem } from '../PassRollLayout'
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
  )
}
