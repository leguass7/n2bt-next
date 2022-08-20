import React from 'react'

import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { NextPage } from 'next'

import { TableArenas } from '~/components/admin/TableArenas'
import { LayoutAdmin } from '~/components/app/LayoutAdmin'

const AdminIndexPage: NextPage = () => {
  return (
    <LayoutAdmin>
      <Grid container spacing={1}>
        <Grid item sm={8}>
          <Card>
            <TableArenas />
          </Card>
        </Grid>
      </Grid>
    </LayoutAdmin>
  )
}

export default AdminIndexPage
