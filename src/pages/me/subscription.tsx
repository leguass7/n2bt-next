import { Typography } from '@mui/material'
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'

import { Layout } from '~/components/app/Layout'

interface PageProps {
  csrfToken?: string
  uaString?: string
}

const MeSubscriptionPage: NextPage<PageProps> = ({}) => {
  // const [data, setData] = useState<IUser>({})

  // const fetchData = useCallback(async () => {
  //   const response = await getMe()
  //   if (response.success) setData(response?.user || {})
  // }, [])

  // useOnceCall(() => {
  //   fetchData()
  // })

  return (
    <Layout>
      <Head>
        <title>Minhas inscrições - N2BT Beach Tennis</title>
        <meta name="description" content="Beach Tennis, Aulas, Torneios e muito mais" />
      </Head>

      <Typography variant="h2" align="center" sx={{ m: 2 }}>
        {'inscrições'}
      </Typography>
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
