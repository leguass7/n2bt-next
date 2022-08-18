import { useCallback, useEffect } from 'react'

import { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { Layout } from '~/components/app/Layout'
import { SiginSlider } from '~/components/SiginSlider'
import { useAppAuth } from '~/hooks/useAppAuth'

interface LoginPageProps {
  csrfToken?: string
  uaString?: string
}

const Login: NextPage<LoginPageProps> = ({}) => {
  const { replace } = useRouter()
  const { authenticated, userData, loading } = useAppAuth()

  const checkLogged = useCallback(() => {
    if (!!authenticated && !loading) {
      if (userData?.level >= 8) {
        replace('/admin')
      } else {
        replace('/')
      }
    }
  }, [userData, replace, authenticated, loading])

  useEffect(() => {
    checkLogged()
  }, [checkLogged])

  return (
    <Layout>
      <Head>
        <title>N2BT Beach Tennis - Login</title>
        <meta name="description" content="Beach Tennis, Aulas, Torneios e muito mais" />
      </Head>
      <SiginSlider />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<LoginPageProps> = async ({ req }) => {
  return {
    props: {
      uaString: req.headers['user-agent']
    }
  }
}

export default Login
