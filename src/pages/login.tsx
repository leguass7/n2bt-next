import { useCallback, useEffect } from 'react'

import { Stack } from '@mui/material'
import { GetServerSideProps, NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

import { FormLogin } from '~/components/FormLogin'

interface LoginPageProps {
  csrfToken?: string
  uaString?: string
}

const Login: NextPage<LoginPageProps> = ({ uaString }) => {
  const { replace } = useRouter()
  const { status } = useSession()

  const checkLogged = useCallback(() => {
    if (status === 'authenticated') replace('/')
  }, [status, replace])

  useEffect(() => {
    checkLogged()
  }, [checkLogged])

  return (
    <>
      <Stack direction={'row'} justifyContent="center" spacing={1} sx={{ marginTop: 2, marginBottom: 2 }}>
        a
      </Stack>
      <p>{uaString}</p>
      <FormLogin />
    </>
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
