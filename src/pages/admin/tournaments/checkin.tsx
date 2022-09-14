import React, { useCallback, useState } from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import type { NextPage, GetServerSideProps } from 'next'
import { unstable_getServerSession } from 'next-auth'

import { LayoutAdmin } from '~/components/app/LayoutAdmin'
import { useOnceCall } from '~/hooks/useOnceCall'
import { createOAuthOptions } from '~/pages/api/auth/[...nextauth]'
import { listCategories } from '~/services/api/category'

type PageProps = {
  tournamentId?: number
}

const AdminTournamentsCheckinPage: NextPage<PageProps> = ({ tournamentId }) => {
  const [loading, setLoading] = useState(false)
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
        <CardContent>sdsdsd</CardContent>
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
    return {
      redirect: { destination: `/login?tournamentId=${tournamentId}` },
      props: { tournamentId }
    }
  }

  return {
    props: {
      session,
      tournamentId
    }
  }
}

export default AdminTournamentsCheckinPage
