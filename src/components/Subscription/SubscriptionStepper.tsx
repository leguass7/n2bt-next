import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'

import { ColorlibConnector, ColorlibStepIcon } from './stepperUtils'

const allSteps = ['Cadastro', 'Categoria', 'Selecionar dupla', 'Pagamento']

function steps(hidePartnerSelection = false) {
  const withoutPartner = allSteps.filter(step => step !== 'Selecionar dupla')
  return hidePartnerSelection ? withoutPartner : allSteps
}

interface Props {
  step?: number
  hidePartnerSelection?: boolean
}

export const SubscriptionStepper: React.FC<Props> = ({ step = 1, hidePartnerSelection }) => {
  return (
    <Stepper alternativeLabel activeStep={step} connector={<ColorlibConnector />}>
      {steps(hidePartnerSelection).map(label => (
        <Step key={label}>
          <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  )
}
