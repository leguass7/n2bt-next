import { useState } from 'react'

import { Main, SliderItem } from '../PassRollLayout'
import { StepCategory } from './steps/StepCategory'
import { StepPartner } from './steps/StepPartner'
import { StepPayment } from './steps/StepPayment'
import { StepStart } from './steps/StepStart'
import { SubscriptionProvider } from './SubscriptionProvider'
import { SubscriptionStepper } from './SubscriptionStepper'

interface Props {
  tournamentId: number
}

export const Subscription: React.FC<Props> = ({ tournamentId }) => {
  const [step, setStep] = useState(0)
  const handleChange = (index: number) => setStep(index - 1)

  return (
    <SubscriptionProvider tournamentId={tournamentId}>
      <div style={{ width: '100%' }}>
        <SubscriptionStepper step={step} />
        <Main name="subscription" onSliderChange={handleChange}>
          <SliderItem>
            <StepStart />
          </SliderItem>
          <SliderItem>
            <StepCategory />
          </SliderItem>
          <SliderItem>
            <StepPartner />
          </SliderItem>
          <SliderItem>
            <StepPayment />
          </SliderItem>
        </Main>
      </div>
    </SubscriptionProvider>
  )
}
