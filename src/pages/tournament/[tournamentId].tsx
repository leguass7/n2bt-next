import { useCallback, useState } from 'react'

import { Typography } from '@mui/material'
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'

import { Layout } from '~/components/app/Layout'
import { useOnceCall } from '~/hooks/useOnceCall'
import type { ITournament } from '~/server-side/useCases/tournament/tournament.dto'
import { getTournament } from '~/services/api/tournament'

interface PageProps {
  tournamentId?: number
  csrfToken?: string
  uaString?: string
}

const TournamentPage: NextPage<PageProps> = ({ tournamentId }) => {
  const [data, setData] = useState<ITournament>({})

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

      <Typography variant="h2" align="center" sx={{ m: 2 }}>
        {data?.title}
      </Typography>
      <Typography variant="body1" align="center" sx={{ m: 2 }}>
        {data?.description}
      </Typography>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({ req, query }) => {
  const tournamentId = +query?.tournamentId || 0
  return {
    props: {
      tournamentId,
      uaString: req.headers['user-agent']
    }
  }
}

export default TournamentPage
