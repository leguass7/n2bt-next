import { AppointmentsPanelActions } from './AppointmentPanelActions'

interface Props {
  fieldId?: number
  onPrev?: () => void
}

export const AppointmentListScreen: React.FC<Props> = ({ fieldId, onPrev }) => {
  return (
    <>
      <AppointmentsPanelActions title="Agendamentos" onPrev={onPrev} />
      Agendamentos aqui {fieldId}
    </>
  )
}
