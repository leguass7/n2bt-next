import React from 'react'

import { ThemeName } from '~/components/AppThemeProvider/themes'

import { Main, SliderItem } from '../PassRollLayout'
import { StepCode } from './StepCode'
import { StepForgot } from './StepForgot'
import { StepSigin } from './StepSigin'

type Props = {
  layoutName?: ThemeName
  reCAPTCHAKey?: string
}
export const SigninSlider: React.FC<Props> = () => {
  // const handleSliderChangeComplete = (index: number) => {
  //   console.log('handleSliderChangeComplete', index)
  // }

  return (
    <Main name="sigin">
      <SliderItem>
        <StepSigin />
      </SliderItem>
      <SliderItem>
        <StepForgot />
      </SliderItem>
      <SliderItem>
        <StepCode />
      </SliderItem>
    </Main>
  )
}
