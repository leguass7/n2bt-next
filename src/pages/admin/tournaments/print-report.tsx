import type { GetServerSideProps, NextPage } from 'next'
import { getServerSession } from 'next-auth'
import dynamic from 'next/dynamic'

import { LayoutPrint } from '~/components/app/LayoutPrint'
import { CircleLoading } from '~/components/CircleLoading'
import { createOAuthOptions } from '~/pages/api/auth/[...nextauth]'
import type { ISubscription } from '~/server-side/useCases/subscriptions/subscriptions.dto'

const DynamicPrintReport = dynamic(() => import('~/components/admin/reports/PrintReport').then(({ PrintReport }) => PrintReport), {
  loading: () => <CircleLoading />,
  ssr: false
})

interface Props {
  isStatic?: boolean
  tournamentId?: number
  subscriptions?: ISubscription[]
}

const AdminTournamentReport: NextPage<Props> = ({ tournamentId }) => {
  return (
    <>
      <LayoutPrint>
        <DynamicPrintReport tournamentId={tournamentId} />
      </LayoutPrint>
    </>
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
    props: { isStatic: true, tournamentId }
  }
}
