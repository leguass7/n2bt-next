import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { useIsMounted } from '~/hooks/useIsMounted'
import { createSubscription } from '~/services/api/subscriptions'

import { CircleLoading } from '../CircleLoading'
import { Main, SliderItem } from '../PassRollLayout'
import { StepCategory } from './steps/StepCategory'
import { StepPartner } from './steps/StepPartner'
import { StepPayment } from './steps/StepPayment'
import { StepStart } from './steps/StepStart'
import { useSubscription } from './SubscriptionProvider'
import { SubscriptionStepper } from './SubscriptionStepper'

interface Props {}

export const Subscription: React.FC<Props> = ({}) => {
  const { category, partner } = useSubscription()

  const [step, setStep] = useState(0)

  const isMounted = useIsMounted()
  const [loading, setLoading] = useState(false)
  const [created, setCreated] = useState(false)

  const handleSubscription = useCallback(async () => {
    if (created) return null
    if (!category || !partner) return null
    setLoading(true)

    const { success = false, message } = await createSubscription({ categoryId: category?.id, partnerId: partner?.id, value: category.price })

    if (isMounted()) {
      setLoading(false)
      setCreated(success)

      if (!success) toast.error(message)
    }
  }, [isMounted, category, partner, created])

  useEffect(() => {
    handleSubscription()
  }, [handleSubscription])

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
          <StepCategory />
        </SliderItem>
        <SliderItem>
          <StepPartner />
        </SliderItem>
        <SliderItem>
          <StepPayment />
        </SliderItem>
      </Main>
      {loading ? <CircleLoading /> : null}
    </div>
  )
}
