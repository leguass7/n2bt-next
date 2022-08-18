import type { GetServerSideProps, NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'

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
    <div>
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
    </div>
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
