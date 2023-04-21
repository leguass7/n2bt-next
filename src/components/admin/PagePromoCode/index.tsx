import React from 'react'

import { Card } from '@mui/material'

import { TablePromoCode } from '~/components/admin/TablePromoCode'
import { TableActionsProvider } from '~/components/tables/TableActionsProvider'

type Props = {
  tournamentId: number
}
export const PagePromoCode: React.FC<Props> = ({ tournamentId }) => {
  return (
    <Card>
      <TableActionsProvider>
        <TablePromoCode tournamentId={tournamentId} />
      </TableActionsProvider>
    </Card>
  )
}
