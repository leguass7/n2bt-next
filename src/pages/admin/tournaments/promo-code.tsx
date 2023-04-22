import React from 'react'

import type { NextPage, GetServerSideProps } from 'next'
import { unstable_getServerSession } from 'next-auth'
import dynamic from 'next/dynamic'

import { LayoutAdmin } from '~/components/app/LayoutAdmin'
import { CircleLoading } from '~/components/CircleLoading'
import { createOAuthOptions } from '~/pages/api/auth/[...nextauth]'

const DynamicPromoCode = dynamic(() => import('~/components/admin/PagePromoCode').then(({ PagePromoCode }) => PagePromoCode), {
  loading: () => <CircleLoading />,
  ssr: false
})

type PageProps = {
  tournamentId?: number
}

const AdminTournamentsPromoCodePage: NextPage<PageProps> = ({ tournamentId }) => {
  return (
    <LayoutAdmin>
      <DynamicPromoCode tournamentId={tournamentId} />
    </LayoutAdmin>
  )
}

export const getServerSideProps: GetServerSideProps<PageProps> = async context => {
  const { query } = context
  const tournamentId = +query?.tournamentId || 0

  const [authOptions] = await createOAuthOptions()
  const session = await unstable_getServerSession(context.req, context.res, authOptions)

  if (!tournamentId) {
    return {
      redirect: { destination: `/admin/tournaments?error=${tournamentId}` },
      props: { tournamentId }
    }
  }

  if (!session) {
    return { redirect: { destination: `/login?tournamentId=${tournamentId}` }, props: { tournamentId } }
  }

  return { props: { session, tournamentId } }
}

export default AdminTournamentsPromoCodePage
