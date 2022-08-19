import React from 'react'

import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { NextPage } from 'next'

import { TableUsers } from '~/components/admin/TableUsers'
import { LayoutAdmin } from '~/components/app/LayoutAdmin'

const AdminUsersPage: NextPage = () => {
  return (
    <LayoutAdmin>
      <Grid container spacing={1}>
        <Grid item sm={8}>
          <Card>
            <TableUsers />
          </Card>
        </Grid>
      </Grid>
    </LayoutAdmin>
  )
}

export default AdminUsersPage
