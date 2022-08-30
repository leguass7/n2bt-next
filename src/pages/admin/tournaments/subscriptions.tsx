import React, { useCallback, useState } from 'react'

import { GetServerSideProps, NextPage } from 'next'
import { unstable_getServerSession } from 'next-auth'

import { TabsSubscriptions } from '~/components/admin/TabsSubscriptions'
import { LayoutAdmin } from '~/components/app/LayoutAdmin'
import { useOnceCall } from '~/hooks/useOnceCall'
import { createOAuthOptions } from '~/pages/api/auth/[...nextauth]'
import { listCategories } from '~/services/api/category'

type PageProps = {
  tournamentId?: number
}
const AdminTournamentSubsPage: NextPage<PageProps> = ({ tournamentId }) => {
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])

  const fetchData = useCallback(async () => {
    setLoading(true)
    const result = await listCategories(tournamentId)
    setLoading(false)
    if (result?.success) {
      setCategories(result?.categories || [])
    }
  }, [tournamentId])

  useOnceCall(fetchData)

  return (
    <LayoutAdmin>
      <>{loading ? null : <TabsSubscriptions categories={categories} />}</>
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

export default AdminTournamentSubsPage
