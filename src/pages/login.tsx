import { useCallback, useEffect } from 'react'

import { GetServerSideProps, NextPage } from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { LayoutSigin } from '~/components/app/LayoutSigin'
import { siteName } from '~/config/constants'
import { useAppAuth } from '~/hooks/useAppAuth'

export const SigninSliderDynamic = dynamic(
  import('~/components/Login').then(ctx => ctx.SigninSlider),
  { ssr: false }
)

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
        replace(`/subscription?tournamentId=${tournamentId}`)
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
        <title>{siteName} - Login</title>
        <meta name="description" content="Beach Tennis, Aulas, Torneios e muito mais" />
      </Head>
      <SigninSliderDynamic uaString={uaString} />
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
