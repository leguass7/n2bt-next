import { useMemo, useState } from 'react'

import { TournamentModality } from '~/server-side/useCases/tournament/tournament.dto'

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
  modality: keyof typeof TournamentModality
}

export const Subscription: React.FC<Props> = ({ tournamentId, maxSubscription, modality }) => {
  const [step, setStep] = useState(0)
  const handleChange = (index: number) => setStep(index - 1)

  const hidePartnerStep = useMemo(() => modality !== 'BEACH_TENNIS', [modality])

  return (
    <SubscriptionProvider tournamentId={tournamentId} maxSubscription={maxSubscription}>
      <div style={{ width: '100%' }}>
        <SubscriptionStepper hidePartnerSelection={hidePartnerStep} step={step} />
        <Main name="subscription" onSliderChange={handleChange}>
          <SliderItem>
            <StepStart icon={icons[1]} />
          </SliderItem>
          <SliderItem>
            <StepCategory icon={icons[2]} />
          </SliderItem>
          {!hidePartnerStep ? (
            <SliderItem>
              <StepPartner icon={icons[3]} />
            </SliderItem>
          ) : null}
          <SliderItem>
            <StepPayment noPartner={hidePartnerStep} icon={icons[4]} />
          </SliderItem>
        </Main>
      </div>
    </SubscriptionProvider>
  )
}
