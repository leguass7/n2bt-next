import React from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import type { GetServerSideProps, NextPage } from 'next'
import { getServerSession } from 'next-auth'

import { TableCategories } from '~/components/admin/TableCategories'
import { TableTournaments } from '~/components/admin/TableTournaments'
import { LayoutAdmin } from '~/components/app/LayoutAdmin'
import { useAppArena } from '~/hooks/useAppArena'
import { createOAuthOptions } from '~/pages/api/auth/[...nextauth]'

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

export const getServerSideProps: GetServerSideProps<any> = async context => {
  const { query } = context
  const tournamentId = +query?.tournamentId || 0

  const [authOptions] = await createOAuthOptions()
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!tournamentId) {
    return {
      redirect: { destination: `/admin/tournaments?error=${tournamentId}` },
      props: { tournamentId }
    }
  }

  if (!session) {
    return { redirect: { destination: `/login?tournamentId=${tournamentId}` }, props: { tournamentId } }
  }

  return { props: { session, tournamentId } }
}

export default AdminTournamentsPage
