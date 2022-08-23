import React from 'react'

import type { ICustomCellProps } from '~/components/CustomTable'
import { CellContainer, CellTools } from '~/components/tables/cells/styles'
import type { ITournament } from '~/server-side/useCases/tournament/tournament.dto'

import { MenuButton } from './MenuButton'

type Props = ICustomCellProps<ITournament> & {}

export const ActionMenuCell: React.FC<Props> = ({ record }) => {
  return (
    <CellContainer>
      <CellTools>
        <MenuButton tournamentId={record?.id} />
      </CellTools>
    </CellContainer>
  )
}
