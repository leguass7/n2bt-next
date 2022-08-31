import { Divider } from '@mui/material'
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'

import { Layout } from '~/components/app/Layout'
import { SectionLogo } from '~/components/SectionLogo'
import { SectionTournaments } from '~/components/SectionTournaments'
import type { ITournament } from '~/server-side/useCases/tournament/tournament.dto'

interface HomePageProps {
  csrfToken?: string
  uaString?: string
  tournaments?: ITournament[]
}

const Home: NextPage<HomePageProps> = ({ tournaments }) => {
  return (
    <Layout>
      <Head>
        <title>N2BT Beach Tennis</title>
        <meta name="description" content="Beach Tennis, Aulas, Torneios e muito mais" />
      </Head>
      <SectionLogo />
      <Divider sx={{ mt: 2 }} />
      <SectionTournaments tournaments={tournaments} />
      <Divider sx={{ mt: 3 }} />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<HomePageProps> = async ({ req }) => {
  const tournaments = []
  return {
    props: {
      uaString: req.headers['user-agent'],
      tournaments
    }
  }
}

export default Home
