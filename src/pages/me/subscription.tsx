import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'

import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'

import { Layout } from '~/components/app/Layout'
import { Paragraph } from '~/components/styled'
import { SubscriptionItem } from '~/components/SubscriptionItem'
import { useOnceCall } from '~/hooks/useOnceCall'
import type { ISubscription } from '~/server-side/useCases/subscriptions/subscriptions.dto'
import { listMeSubscriptions } from '~/services/api/me'
import { deleteMeSubscriptions } from '~/services/api/me'
interface PageProps {
  csrfToken?: string
  uaString?: string
}

const MeSubscriptionPage: NextPage<PageProps> = ({}) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<ISubscription[]>([])

  const fetchData = useCallback(async () => {
    setLoading(true)
    const response = await listMeSubscriptions()
    setLoading(false)
    if (response.success) setData(response?.subscriptions || [])
  }, [])

  useOnceCall(() => {
    fetchData()
  })

  const handleDeleteSubscription = useCallback(
    async (id: number) => {
      const response = await deleteMeSubscriptions(id)
      if (!response?.success) toast.error(response?.message || 'Erro ao excluir')
      else fetchData()
    },
    [fetchData]
  )

  return (
    <Layout isProtected>
      <Head>
        <title>Minhas inscrições - N2BT Beach Tennis</title>
        <meta name="description" content="Beach Tennis, Aulas, Torneios e muito mais" />
      </Head>
      <Typography variant="h5" component="div" align="center" sx={{ m: 2 }}>
        {'Minhas inscrições'}
      </Typography>
      <Divider />
      {!data?.length ? (
        <Paragraph textSize={30} align="center" verticalSpaced>
          {!loading ? 'Você não possui inscrições' : 'carregando...'}
        </Paragraph>
      ) : null}
      <Grid container spacing={1}>
        <Grid item xs sm={10} md={6} sx={{ mt: 2 }}>
          {data?.map(subscription => {
            return <SubscriptionItem key={`sub-item-${subscription?.id}`} {...subscription} onDelete={handleDeleteSubscription} />
          })}
        </Grid>
      </Grid>
      <Typography variant="body1" align="center" sx={{ m: 2 }}>
        <Link href={'/'}>PÁGINA PRINCIPAL</Link>
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
