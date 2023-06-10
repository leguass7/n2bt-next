import React from 'react'

import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { GetServerSideProps, NextPage } from 'next'
import { getServerSession } from 'next-auth'

import { LayoutAdmin } from '~/components/app/LayoutAdmin'

import { createOAuthOptions } from '../api/auth/[...nextauth]'

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

export const getServerSideProps: GetServerSideProps<Record<string, any>> = async context => {
  const [authOptions] = await createOAuthOptions()
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session) {
    return { redirect: { destination: `/login` }, props: {} }
  }

  return { props: { session } }
}

export default AdminIndexPage
