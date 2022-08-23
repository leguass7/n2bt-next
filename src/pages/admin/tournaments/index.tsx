import React from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { NextPage } from 'next'

import { TableTournaments } from '~/components/admin/TableTournaments'
import { LayoutAdmin } from '~/components/app/LayoutAdmin'
import { useAppArena } from '~/hooks/useAppArena'

const AdminTournamentsPage: NextPage = () => {
  const { arenaId } = useAppArena()
  return (
    <LayoutAdmin>
      <Grid container spacing={1}>
        {arenaId ? (
          <Grid item sm={8}>
            <Card>
              <TableTournaments />
            </Card>
          </Grid>
        ) : (
          <Grid item sm={8}>
            <Card>
              <CardContent>
                <Typography variant="body1">Selecione uma arena</Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </LayoutAdmin>
  )
}

export default AdminTournamentsPage
