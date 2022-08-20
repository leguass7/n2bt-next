import type { GetServerSideProps, NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { Layout } from '~/components/app/Layout'
import { useAppAuth } from '~/hooks/useAppAuth'

interface HomePageProps {
  csrfToken?: string
  uaString?: string
}

const Home: NextPage<HomePageProps> = ({ uaString }) => {
  const { data, status } = useSession()
  const { logOut, authenticated, userData } = useAppAuth()
  const { push } = useRouter()

  const sair = async () => {
    await logOut()
    push('/login')
  }

  return (
    <Layout>
      <Head>
        <title>N2BT Beach Tennis</title>
        <meta name="description" content="Beach Tennis, Aulas, Torneios e muito mais" />
      </Head>
      HOME: {status}
      <p>
        <code>{JSON.stringify(userData)}</code>
        <br />
        <code>{JSON.stringify(data)}</code>
      </p>
      <p>{uaString}</p>
      {authenticated ? (
        <button type="button" onClick={sair}>
          SAIR
        </button>
      ) : (
        <Link href={'/login'}>Login</Link>
      )}
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
