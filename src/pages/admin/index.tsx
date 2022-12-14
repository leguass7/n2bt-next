import React from 'react'

import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { NextPage } from 'next'

import { LayoutAdmin } from '~/components/app/LayoutAdmin'

const AdminIndexPage: NextPage = () => {
  return (
    <LayoutAdmin>
      <Grid container spacing={1}>
        <Grid item sm={8}>
          <Card>Index</Card>
        </Grid>
      </Grid>
    </LayoutAdmin>
  )
}

export default AdminIndexPage
