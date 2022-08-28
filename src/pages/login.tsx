import { useCallback, useEffect } from 'react'

import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { LayoutSigin } from '~/components/app/LayoutSigin'
import { SigninSlider } from '~/components/Login'
import { useAppAuth } from '~/hooks/useAppAuth'

interface LoginPageProps {
  csrfToken?: string
  uaString?: string
  tournamentId?: number
}

const Login: NextPage<LoginPageProps> = ({ uaString, tournamentId }) => {
  const { replace } = useRouter()
  const { authenticated, userData, loading } = useAppAuth()

  const checkLogged = useCallback(() => {
    if (!!authenticated && !loading) {
      if (tournamentId) {
        replace(`/subscription/${tournamentId}`)
      } else if (userData?.level >= 8) {
        replace('/admin')
      } else {
        replace('/')
      }
    }
  }, [userData, replace, authenticated, loading, tournamentId])

  useEffect(() => {
    checkLogged()
  }, [checkLogged])

  return (
    <LayoutSigin>
      <Head>
        <title>N2BT Beach Tennis - Login</title>
        <meta name="description" content="Beach Tennis, Aulas, Torneios e muito mais" />
      </Head>
      <SigninSlider uaString={uaString} />
    </LayoutSigin>
  )
}

export const getServerSideProps: GetServerSideProps<LoginPageProps> = async ({ req, query }) => {
  const tournamentId = +query?.tournamentId
  return {
    props: {
      tournamentId,
      uaString: req.headers['user-agent']
    }
  }
}

export default Login
