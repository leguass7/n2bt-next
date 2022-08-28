import { Button, Stack } from '@mui/material'
import { differenceInMinutes } from 'date-fns'
import type { GetServerSideProps, NextPage } from 'next'
import { unstable_getServerSession } from 'next-auth/next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { Layout } from '~/components/app/Layout'
import { CircleLoading } from '~/components/CircleLoading'
import { BoxCenter, FlexContainer, H4, Paragraph } from '~/components/styled'
import { Subscription } from '~/components/Subscription'
import type { ITournament } from '~/server-side/useCases/tournament/tournament.dto'
import { Tournament } from '~/server-side/useCases/tournament/tournament.entity'

import { createOAuthOptions } from '../api/auth/[...nextauth]'

interface Props {
  tournamentId: number
  tournament?: Partial<ITournament>
  isExpired?: boolean
}

const SubscriptionPage: NextPage<Props> = ({ tournamentId, tournament, isExpired }) => {
  const { isFallback, replace } = useRouter()

  const description = tournament?.description || 'Beach Tennis, Aulas, Torneios e muito mais'

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
          <Subscription tournamentId={tournamentId} />
        )}
      </BoxCenter>
      {isFallback ? <CircleLoading /> : null}
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async context => {
  console.log('Entrando em serverless function')
  const { params } = context
  const tournamentId = +params?.tournamentId || 0

  const [authOptions, ds] = await createOAuthOptions()
  const session = await unstable_getServerSession(context.req, context.res, authOptions)

  console.log('session getServerSideProps', session)

  if (!session) {
    return {
      redirect: { destination: `/login?tournamentId=${tournamentId}` },
      props: { tournamentId }
    }
  }

  // const ds = await prepareConnection()
  const repo = ds.getRepository(Tournament)

  const tournament = await repo.findOne({ where: { id: tournamentId } })
  const isExpired = !!(tournament?.subscriptionExpiration && differenceInMinutes(tournament?.subscriptionExpiration, new Date()) <= 0)

  return {
    props: {
      session,
      isExpired,
      tournamentId,
      tournament: { title: tournament?.title, description: tournament?.description }
    }
  }
}

export default SubscriptionPage
