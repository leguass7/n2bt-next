import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { Layout } from '~/components/app/Layout'
import { CircleLoading } from '~/components/CircleLoading'
import { BoxCenter, H4 } from '~/components/styled'
import { Subscription } from '~/components/Subscription'
import { SubscriptionProvider } from '~/components/Subscription/SubscriptionProvider'
import { prepareConnection } from '~/server-side/database/conn'
import type { ITournament } from '~/server-side/useCases/tournament/tournament.dto'
import { Tournament } from '~/server-side/useCases/tournament/tournament.entity'

interface Props {
  tournamentId: number
  tournament?: Partial<ITournament>
}

const TournamentSubscription: NextPage<Props> = ({ tournamentId, tournament }) => {
  const { isFallback } = useRouter()

  const description = tournament?.description || 'Beach Tennis, Aulas, Torneios e muito mais'

  return (
    <Layout>
      <Head>
        <title>{tournament?.title} - N2BT Beach Tennis</title>
        <meta name="description" content={description} />
      </Head>
      <BoxCenter>
        <H4 textSize={24}>Inscrição do torneio</H4>
        <SubscriptionProvider tournamentId={tournamentId}>
          <Subscription />
        </SubscriptionProvider>
      </BoxCenter>
      {isFallback ? <CircleLoading /> : null}
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
  const tournamentId = +params?.tournamentId || 0

  const ds = await prepareConnection()
  const repo = ds.getRepository(Tournament)

  const tournament = await repo.findOne({ where: { id: tournamentId } })

  return {
    props: {
      tournamentId,
      tournament: {
        title: tournament?.title,
        description: tournament?.description
      }
    }
  }
}

export default TournamentSubscription

// export const getStaticPaths: GetStaticPaths = async () => {
//   // passar alguns ids de torneios para serem pré-renderizados pelo next

//   return {
//     fallback: true,
//     paths: [{ params: { tournamentId: '2' } }]
//   }
// }

// export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
//   console.log('params', params)
//   return {
//     props: { tournamentId: 2 }
//   }
// }
