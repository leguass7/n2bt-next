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
}
export const SigninSlider: React.FC<Props> = () => {
  // const handleSliderChangeComplete = (index: number) => {
  //   console.log('handleSliderChangeComplete', index)
  // }

  return (
    <Main name="signIn">
      <SliderItem>
        <StepSignin />
      </SliderItem>
      <SliderItem>
        <StepForgot />
      </SliderItem>
      <SliderItem>
        <StepCode />
      </SliderItem>
      <SliderItem>
        <StepSignup />
      </SliderItem>
    </Main>
  )
}
