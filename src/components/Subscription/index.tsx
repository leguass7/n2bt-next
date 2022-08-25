import { useCallback, useState } from 'react'

import { Main, SliderItem } from '../PassRollLayout'
import { StepPartner } from './steps/StepPartner'
import { StepStart } from './steps/StepStart'
import { SubscriptionStepper } from './SubscriptionStepper'

interface Props {}

export const Subscription: React.FC<Props> = () => {
  const [step, setStep] = useState(0)

  const handleChange = useCallback((index: number) => {
    setStep(index - 1)
  }, [])

  return (
    <div style={{ width: '100%' }}>
      <SubscriptionStepper step={step} />
      <Main name="subscription" onSliderChange={handleChange}>
        <SliderItem>
          <StepStart />
        </SliderItem>
        <SliderItem>
          <StepPartner />
        </SliderItem>
      </Main>
    </div>
  )
}
