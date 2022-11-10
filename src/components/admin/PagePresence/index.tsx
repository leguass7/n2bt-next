import React from 'react'

import { Card, Divider } from '@mui/material'

import { TableCheckin } from '~/components/admin/TableCheckin'
import { TableActionsProvider } from '~/components/tables/TableActionsProvider'
import type { ICategory } from '~/server-side/useCases/category/category.dto'

type Props = {
  tournamentId: number
  categories: ICategory[]
}
export const PagePresence: React.FC<Props> = ({ tournamentId, categories }) => {
  return (
    <>
      <Divider sx={{ mt: 1, mb: 1 }} />
      <Card>
        <TableActionsProvider>
          <TableCheckin tournamentId={tournamentId} categories={categories} />
        </TableActionsProvider>
      </Card>
    </>
  )
}
