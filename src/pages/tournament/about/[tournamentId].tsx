import { useCallback, useState } from 'react'

import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'

import { Layout } from '~/components/app/Layout'
import { RankingPanel } from '~/components/Rankings/RankingPanel'
import { useOnceCall } from '~/hooks/useOnceCall'
import type { ITournament } from '~/server-side/useCases/tournament/tournament.dto'
import { getTournament } from '~/services/api/tournament'

interface PageProps {
  tournamentId?: number
  csrfToken?: string
  uaString?: string
}

const TournamentAboutPage: NextPage<PageProps> = ({ tournamentId }) => {
  const [data, setData] = useState<Partial<ITournament>>({})

  const fetchData = useCallback(async () => {
    const response = await getTournament(tournamentId)
    if (response.success) setData(response?.tournament || {})
  }, [tournamentId])

  useOnceCall(() => {
    fetchData()
  })

  return (
    <Layout>
      <Head>
        <title>{data?.title} N2BT Beach Tennis</title>
        <meta name="description" content="Beach Tennis, Aulas, Torneios e muito mais" />
      </Head>
      <RankingPanel tournament={data} tournamentId={tournamentId} />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({ req, params }) => {
  const tournamentId = +params?.tournamentId || 0

  return {
    props: {
      tournamentId,
      uaString: req.headers['user-agent']
    }
  }
}

export default TournamentAboutPage
