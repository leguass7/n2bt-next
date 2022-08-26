import { Step, StepLabel, Stepper } from '@mui/material'

import { ColorlibConnector, ColorlibStepIcon } from './stepperUtils'

const steps = ['Cadastro', 'Categoria', 'Selecionar dupla', 'Pagamento']

interface Props {
  step?: number
}

export const SubscriptionStepper: React.FC<Props> = ({ step = 1 }) => {
  return (
    <Stepper alternativeLabel activeStep={step} connector={<ColorlibConnector />}>
      {steps.map(label => (
        <Step key={label}>
          <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  )
}
