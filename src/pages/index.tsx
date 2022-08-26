import Button from '@mui/material/Button'
import type { GetServerSideProps, NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Head from 'next/head'

import { Layout } from '~/components/app/Layout'
import { SectionLogo } from '~/components/SectionLogo'
import { SectionTournaments } from '~/components/SectionTournaments'
import { useAppAuth } from '~/hooks/useAppAuth'

interface HomePageProps {
  csrfToken?: string
  uaString?: string
}

const Home: NextPage<HomePageProps> = ({}) => {
  // const { push } = useRouter()
  const { status } = useSession()
  const { logOut } = useAppAuth()

  return (
    <Layout>
      <Head>
        <title>N2BT Beach Tennis</title>
        <meta name="description" content="Beach Tennis, Aulas, Torneios e muito mais" />
      </Head>
      <Button variant="outlined" onClick={() => logOut()}>
        {status}
      </Button>
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
