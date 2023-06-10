import React from 'react'

import { Card, Grid } from '@mui/material'

import { TablePromoCode } from '~/components/admin/TablePromoCode'
import { TableActionsProvider } from '~/components/tables/TableActionsProvider'

type Props = {
  tournamentId: number
}
export const PagePromoCode: React.FC<Props> = ({ tournamentId }) => {
  return (
    <Grid container sx={{ maxWidth: '100%' }}>
      <Grid item xl={8} lg={8} xs={12} sx={{ maxWidth: '100%' }}>
        <Card>
          <TableActionsProvider>
            <TablePromoCode tournamentId={tournamentId} />
          </TableActionsProvider>
        </Card>
      </Grid>
      <Grid item>
        <br />
        <br />
      </Grid>
    </Grid>
  )
}
