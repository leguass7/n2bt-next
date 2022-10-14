import { NextPage } from 'next'
import Link from 'next/link'

import { LayoutAdmin } from '~/components/app/LayoutAdmin'

interface Props {}

const AdminTournamentReport: NextPage<Props> = () => {
  return (
    <LayoutAdmin>
      <Link href="/admin/tournaments">
        <a>Voltar</a>
      </Link>

      <h1>Página de relatório</h1>
    </LayoutAdmin>
  )
}

export default AdminTournamentReport
