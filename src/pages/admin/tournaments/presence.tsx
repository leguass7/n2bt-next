import React, { useCallback, useState } from 'react'

import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import type { NextPage, GetServerSideProps } from 'next'
import { unstable_getServerSession } from 'next-auth'

import { TableCheckin } from '~/components/admin/TableCheckin'
import { LayoutAdmin } from '~/components/app/LayoutAdmin'
import { TableActionsProvider } from '~/components/tables/TableActionsProvider'
import { useOnceCall } from '~/hooks/useOnceCall'
import { createOAuthOptions } from '~/pages/api/auth/[...nextauth]'
import { listCategories } from '~/services/api/category'

type PageProps = {
  tournamentId?: number
}

const AdminTournamentsPresencePage: NextPage<PageProps> = ({ tournamentId }) => {
  const [, setLoading] = useState(false)
  const [categories, setCategories] = useState([])

  const fetchData = useCallback(async () => {
    setLoading(true)
    const result = await listCategories(tournamentId, { order: 'asc', orderby: 'title' })
    setLoading(false)
    if (result?.success) {
      setCategories(result?.categories || [])
    }
  }, [tournamentId])

  useOnceCall(fetchData)

  return (
    <LayoutAdmin>
      <Divider sx={{ mt: 1, mb: 1 }} />
      <Card>
        <TableActionsProvider>
          <TableCheckin tournamentId={tournamentId} categories={categories} />
        </TableActionsProvider>
      </Card>
    </LayoutAdmin>
  )
}

export const getServerSideProps: GetServerSideProps<PageProps> = async context => {
  const { query } = context
  const tournamentId = +query?.tournamentId || 0

  const [authOptions] = await createOAuthOptions()
  const session = await unstable_getServerSession(context.req, context.res, authOptions)

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

export default AdminTournamentsPresencePage
