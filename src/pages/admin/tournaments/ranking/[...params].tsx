import React, { useCallback, useState } from 'react'

import { GetServerSideProps, NextPage } from 'next'

import { TabsCategoryRanking } from '~/components/admin/TabsCategoryRanking'
import { LayoutAdmin } from '~/components/app/LayoutAdmin'
import { useOnceCall } from '~/hooks/useOnceCall'
import { listCategories } from '~/services/api/category'

type PageProps = {
  tournamentId?: number
}
const AdminTournamentsRankingPage: NextPage<PageProps> = ({ tournamentId }) => {
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

  useOnceCall(() => fetchData())

  return (
    <LayoutAdmin>
      <>{loading ? null : <TabsCategoryRanking categories={categories} />}</>
    </LayoutAdmin>
  )
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({ req, query }) => {
  const params = (query?.params || []) as string[]
  const [tournamentId] = params.map(p => +p || 0).filter(f => !!f)

  // const tournamentId = +query?.tournamentId || 0
  return {
    props: {
      tournamentId,
      uaString: req.headers['user-agent']
    }
  }
}

export default AdminTournamentsRankingPage
