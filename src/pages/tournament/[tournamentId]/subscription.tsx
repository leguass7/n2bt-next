import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { Layout } from '~/components/app/Layout'
import { CircleLoading } from '~/components/CircleLoading'
import { SectionLogo } from '~/components/SectionLogo'
import { BoxCenter } from '~/components/styled'

interface Props {
  tournamentId: string
}

const TournamentSubscription: NextPage<Props> = () => {
  const { isFallback } = useRouter()

  return (
    <Layout>
      <Head>
        <title>N2BT Beach Tennis</title>
        <meta name="description" content="Beach Tennis, Aulas, Torneios e muito mais" />
      </Head>
      <SectionLogo />
      <BoxCenter style={{ padding: 12 }}>Página de inscrição do torneio</BoxCenter>
      {isFallback ? <CircleLoading /> : null}
    </Layout>
  )
}

export default TournamentSubscription

export const getStaticPaths: GetStaticPaths = async () => {
  // passar alguns ids de torneios para serem pré-renderizados pelo next

  return {
    fallback: true,
    paths: [{ params: { tournamentId: '2' } }]
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  return {
    props: { ...params }
  }
}
