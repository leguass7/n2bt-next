import React from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import type { NextPage } from 'next'

import { TableCategories } from '~/components/admin/TableCategories'
import { TableTournaments } from '~/components/admin/TableTournaments'
import { LayoutAdmin } from '~/components/app/LayoutAdmin'
import { useAppArena } from '~/hooks/useAppArena'

const AdminTournamentsPage: NextPage = () => {
  const { arenaId } = useAppArena()

  return (
    <LayoutAdmin>
      {arenaId ? (
        <Card>
          <TableTournaments />
        </Card>
      ) : (
        <Card>
          <CardContent>
            <Typography variant="body1">Selecione uma arena</Typography>
          </CardContent>
        </Card>
      )}
      <Divider sx={{ mt: 1, mb: 1 }} />
      <Card>
        <CardContent>
          <TableCategories />
        </CardContent>
      </Card>
    </LayoutAdmin>
  )
}

export default AdminTournamentsPage
