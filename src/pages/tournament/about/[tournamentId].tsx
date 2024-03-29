import { useCallback, useMemo, useState } from 'react'

import type { GetServerSideProps, NextPage } from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'

import { Layout } from '~/components/app/Layout'
import { CircleLoading } from '~/components/CircleLoading'
import { siteName } from '~/config/constants'
import { useOnceCall } from '~/hooks/useOnceCall'
import { type ITournament, TournamentModality } from '~/server-side/useCases/tournament/tournament.dto'
import { getTournament } from '~/services/api/tournament'

const DynamicRankingPanel = dynamic(() => import('~/components/Rankings/RankingPanel').then(({ RankingPanel }) => RankingPanel), {
  loading: () => <CircleLoading size={24} color="#f00" />,
  ssr: false
})

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

  const hasPairs = useMemo(() => {
    return data.modality === TournamentModality.BEACH_TENNIS
  }, [data])

  useOnceCall(() => {
    fetchData()
  })

  return (
    <Layout>
      <Head>
        <title>
          {data?.title} {siteName}
        </title>
        <meta name="description" content="Beach Tennis, Aulas, Torneios e muito mais" />
      </Head>
      <DynamicRankingPanel hasPairs={hasPairs} tournament={data} tournamentId={tournamentId} />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({ req, params }) => {
  const tournamentId = +params?.tournamentId || 0

  return {
    props: {
      tournamentId,
      uaString: req?.headers?.['user-agent']
    }
  }
}

export default TournamentAboutPage
