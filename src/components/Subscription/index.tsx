import { useState } from 'react'

import { Main, SliderItem } from '../PassRollLayout'
import { icons } from './stepperUtils'
import { StepCategory } from './steps/StepCategory'
import { StepPartner } from './steps/StepPartner'
import { StepPayment } from './steps/StepPayment'
import { StepStart } from './steps/StepStart'
import { SubscriptionProvider } from './SubscriptionProvider'
import { SubscriptionStepper } from './SubscriptionStepper'

interface Props {
  tournamentId: number
  maxSubscription: number
}

export const Subscription: React.FC<Props> = ({ tournamentId, maxSubscription }) => {
  const [step, setStep] = useState(0)
  const handleChange = (index: number) => setStep(index - 1)

  return (
    <SubscriptionProvider tournamentId={tournamentId} maxSubscription={maxSubscription}>
      <div style={{ width: '100%' }}>
        <SubscriptionStepper step={step} />
        <Main name="subscription" onSliderChange={handleChange}>
          <SliderItem>
            <StepStart icon={icons[1]} />
          </SliderItem>
          <SliderItem>
            <StepCategory icon={icons[2]} />
          </SliderItem>
          <SliderItem>
            <StepPartner icon={icons[3]} />
          </SliderItem>
          <SliderItem>
            <StepPayment icon={icons[4]} />
          </SliderItem>
        </Main>
      </div>
    </SubscriptionProvider>
  )
}
