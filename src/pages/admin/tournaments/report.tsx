import { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'

import { LayoutAdmin } from '~/components/app/LayoutAdmin'

interface Props {
  tournamentId?: number
}

const AdminTournamentReport: NextPage<Props> = () => {
  return (
    <LayoutAdmin>
      <Link href="/admin/tournaments">
        <a>Voltar</a>
      </Link>

      <h1>Página de relatório </h1>
    </LayoutAdmin>
  )
}

export default AdminTournamentReport

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  return {
    props: { tournamentId: +query?.tournamentId }
  }
}
