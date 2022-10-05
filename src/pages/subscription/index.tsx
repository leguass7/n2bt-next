import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { differenceInMinutes } from 'date-fns'
import type { GetServerSideProps, NextPage } from 'next'
import { unstable_getServerSession } from 'next-auth/next'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { Layout } from '~/components/app/Layout'
import { CircleLoading } from '~/components/CircleLoading'
import { BoxCenter, FlexContainer, H4, Paragraph } from '~/components/styled'
import type { ITournament } from '~/server-side/useCases/tournament/tournament.dto'
import { Tournament } from '~/server-side/useCases/tournament/tournament.entity'

import { createOAuthOptions } from '../api/auth/[...nextauth]'

const DynamicSubscription = dynamic(() => import('../../components/Subscription').then(({ Subscription }) => Subscription), {
  loading: () => <CircleLoading />,
  ssr: false
})

interface Props {
  tournamentId: number
  tournament?: Partial<ITournament>
  isExpired?: boolean
}

const SubscriptionPage: NextPage<Props> = ({ tournamentId, tournament, isExpired }) => {
  const { replace } = useRouter()

  const description = tournament?.description || 'Beach Tennis, Aulas, Torneios e muito mais'

  tournament.maxSubscription
  return (
    <Layout>
      <Head>
        <title>{tournament?.title} - N2BT Beach Tennis</title>
        <meta name="description" content={description} />
      </Head>
      <BoxCenter>
        <FlexContainer justify="center" align="center" verticalPad={10}>
          <H4 textSize={24}>Inscrição para {tournament?.title}</H4>
        </FlexContainer>
        {isExpired ? (
          <>
            <Paragraph align="center">Inscrições para esse torneio já foram encerradas</Paragraph>
            <Stack direction={'row'} spacing={2} sx={{ mt: 2 }}>
              <Button variant="outlined" onClick={() => replace(`/`)}>
                Página principal
              </Button>
              <Button variant="outlined" onClick={() => replace(`/tournament/about/${tournamentId}`)}>
                Saiba mais
              </Button>
            </Stack>
          </>
        ) : (
          <DynamicSubscription tournamentId={tournamentId} maxSubscription={tournament?.maxSubscription} />
        )}
      </BoxCenter>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async context => {
  const { query } = context
  const tournamentId = +query?.tournamentId || 0

  const [authOptions, ds] = await createOAuthOptions()
  const session = await unstable_getServerSession(context.req, context.res, authOptions)

  if (!tournamentId) {
    return {
      redirect: { destination: `/login?tournamentError=${tournamentId}` },
      props: { tournamentId }
    }
  }

  if (!session) {
    return {
      redirect: { destination: `/login?tournamentId=${tournamentId}` },
      props: { tournamentId }
    }
  }

  //
  const repo = ds.getRepository(Tournament)
  const tournament = await repo.findOne({ where: { id: tournamentId } })
  const isExpired = !!(tournament?.subscriptionEnd && differenceInMinutes(tournament?.subscriptionEnd, new Date()) <= 0)

  return {
    props: {
      session,
      isExpired,
      tournamentId,
      tournament: { title: tournament?.title, description: tournament?.description, maxSubscription: tournament?.maxSubscription }
    }
  }
}

export default SubscriptionPage
