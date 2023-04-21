import { PlayFieldSelect } from '../../PlayFields/PlayFieldSelect'
import { AppointmentsPanelActions } from './AppointmentPanelActions'

interface Props {
  arenaId: number
  onSelect: (id: number) => void
}

export const AppointmentSelectScreen: React.FC<Props> = ({ onSelect, arenaId }) => {
  return (
    <>
      <AppointmentsPanelActions title="Selecione um campo" />
      <PlayFieldSelect onSelect={onSelect} arenaId={arenaId} />
    </>
  )
}
