import type { GetServerSideProps, NextPage } from 'next'
import { getServerSession } from 'next-auth'
import dynamic from 'next/dynamic'

import { LayoutAdmin } from '~/components/app/LayoutAdmin'
import { CircleLoading } from '~/components/CircleLoading'
import { createOAuthOptions } from '~/pages/api/auth/[...nextauth]'
import type { ISubscription } from '~/server-side/useCases/subscriptions/subscriptions.dto'

const DynamicShirtsReport = dynamic(() => import('~/components/admin/ShirtsReport').then(({ ShirtsReport }) => ShirtsReport), {
  loading: () => <CircleLoading color="#f00" />,
  ssr: false
})

interface Props {
  tournamentId?: number
  subscriptions?: ISubscription[]
}

const AdminTournamentReport: NextPage<Props> = ({ tournamentId }) => {
  return (
    <LayoutAdmin>
      <DynamicShirtsReport tournamentId={tournamentId} />
    </LayoutAdmin>
  )
}

export default AdminTournamentReport

export const getServerSideProps: GetServerSideProps<Props> = async context => {
  const tournamentId = +context?.query?.tournamentId || 0

  const [authOptions] = await createOAuthOptions()
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!tournamentId) {
    return {
      redirect: { destination: `/admin/tournaments?error=${tournamentId}` },
      props: { tournamentId }
    }
  }

  if (!session) {
    return {
      redirect: { destination: `/login?tournamentId=${tournamentId}` },
      props: { tournamentId }
    }
  }

  return {
    props: { tournamentId }
  }
}
