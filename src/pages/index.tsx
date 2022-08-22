import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'

import { Layout } from '~/components/app/Layout'
import { SectionLogo } from '~/components/SectionLogo'
import { SectionTournaments } from '~/components/SectionTournaments'

interface HomePageProps {
  csrfToken?: string
  uaString?: string
}

const Home: NextPage<HomePageProps> = ({}) => {
  // const { push } = useRouter()

  return (
    <Layout>
      <Head>
        <title>N2BT Beach Tennis</title>
        <meta name="description" content="Beach Tennis, Aulas, Torneios e muito mais" />
      </Head>
      <SectionLogo />
      <SectionTournaments />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<HomePageProps> = async ({ req }) => {
  return {
    props: {
      uaString: req.headers['user-agent']
    }
  }
}

export default Home
