import React from 'react'

import { Card, Divider } from '@mui/material'

import { TableActionsProvider } from '~/components/tables/TableActionsProvider'

type Props = {
  tournamentId: number
}
export const PagePromoCode: React.FC<Props> = ({ tournamentId }) => {
  return (
    <>
      <Divider sx={{ mt: 1, mb: 1 }} />
      <Card>
        <TableActionsProvider>{/* <TableCheckin tournamentId={tournamentId} categories={categories} /> */}</TableActionsProvider>
      </Card>
    </>
  )
}
