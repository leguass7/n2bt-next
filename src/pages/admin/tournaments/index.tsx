import React from 'react'

import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { NextPage } from 'next'

import { TableTournaments } from '~/components/admin/TableTournaments'
import { LayoutAdmin } from '~/components/app/LayoutAdmin'

const AdminTournamentsPage: NextPage = () => {
  return (
    <LayoutAdmin>
      <Grid container spacing={1}>
        <Grid item sm={8}>
          <Card>
            <TableTournaments />
          </Card>
        </Grid>
      </Grid>
    </LayoutAdmin>
  )
}

export default AdminTournamentsPage
