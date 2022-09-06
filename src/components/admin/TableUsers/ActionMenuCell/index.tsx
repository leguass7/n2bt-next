import React from 'react'

import { CellContainer, CellTools } from '~/components/tables/cells/styles'

import type { UserCellProps } from '../Cells'
import { MenuButton } from './MenuButton'

export const ActionMenuCell: React.FC<UserCellProps> = ({ record }) => {
  const enableDelete = !record?.totalPayments && !record?.totalSubscriptions
  return (
    <CellContainer>
      <CellTools>
        <MenuButton useId={record?.id} enableDelete={!!enableDelete} />
      </CellTools>
    </CellContainer>
  )
}
