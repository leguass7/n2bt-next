import Divider from '@mui/material/Divider'
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'

import { Layout } from '~/components/app/Layout'
// import { SectionLogo } from '~/components/SectionLogo'
import { SectionTournaments } from '~/components/SectionTournaments'
import { FlexContainer, Text } from '~/components/styled'
import { siteName } from '~/config/constants'
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
        <title>{siteName}</title>
        <meta name="description" content="Beach Tennis, Aulas, Torneios e muito mais" />
      </Head>
      <br />
      <br />
      {/* <SectionLogo /> */}
      <Divider sx={{ mt: 2 }} />
      <SectionTournaments tournaments={tournaments} />
      <Divider sx={{ mt: 3 }} />
      <FlexContainer direction="row" justify="center">
        <Text align="center" textColor="#000">
          Avatar Soluções Digitais CNPJ: 26.370.490/0001-01
        </Text>
      </FlexContainer>
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
