import type { ICustomCellProps } from '~/components/CustomTable'
import { CellContainer, CellTools } from '~/components/tables/cells/styles'
import type { ITournament } from '~/server-side/useCases/tournament/tournament.dto'
import { TournamentModality } from '~/server-side/useCases/tournament/tournament.dto'

import { MenuButton } from './MenuButton'

type Props = ICustomCellProps<ITournament> & {}

const hasPartner = (modality: keyof typeof TournamentModality) => modality === TournamentModality.BEACH_TENNIS

export const ActionMenuCell: React.FC<Props> = ({ record }) => {
  return (
    <CellContainer>
      <CellTools>
        <MenuButton tournamentId={record?.id} noPartner={!hasPartner(record?.modality)} />
      </CellTools>
    </CellContainer>
  )
}
