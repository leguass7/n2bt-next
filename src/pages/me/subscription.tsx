import { useCallback, useState } from 'react'

import { Divider, Grid } from '@mui/material'
import Typography from '@mui/material/Typography'
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'

import { Layout } from '~/components/app/Layout'
import { useOnceCall } from '~/hooks/useOnceCall'
import type { ISubscription } from '~/server-side/useCases/subscriptions/subscriptions.dto'
import { listMeSubscriptions } from '~/services/api/user/me'

interface PageProps {
  csrfToken?: string
  uaString?: string
}

const MeSubscriptionPage: NextPage<PageProps> = ({}) => {
  const [data, setData] = useState<ISubscription[]>([])

  const fetchData = useCallback(async () => {
    const response = await listMeSubscriptions()
    if (response.success) setData(response?.subscriptions || [])
  }, [])

  useOnceCall(() => {
    fetchData()
  })

  return (
    <Layout>
      <Head>
        <title>Minhas inscrições - N2BT Beach Tennis</title>
        <meta name="description" content="Beach Tennis, Aulas, Torneios e muito mais" />
      </Head>
      <Typography variant="h5" component="div" align="center" sx={{ m: 2 }}>
        {'Minhas inscrições'}
      </Typography>
      <Divider />
      <Grid container sx={{ flexGrow: 1 }} xs={12}>
        <Grid item xs={12} sm={6}>
          asas
        </Grid>
        <Grid item xs={12} sm={6}>
          {' '}
        </Grid>
      </Grid>
      <Typography variant="body1" align="center" sx={{ m: 2 }}>
        <Link href={'/'}>VOLTAR</Link>
      </Typography>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({ req }) => {
  return {
    props: {
      uaString: req.headers['user-agent']
    }
  }
}

export default MeSubscriptionPage
