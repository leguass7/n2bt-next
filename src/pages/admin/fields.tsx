import { type NextPage } from 'next'

import { PlayFieldList } from '~/components/admin/PlayFields/PlayFieldList'
import { LayoutAdmin } from '~/components/app/LayoutAdmin'
import { useAppArena } from '~/hooks/useAppArena'

const AdminFieldsPage: NextPage = () => {
  const { arenaId } = useAppArena()

  return (
    <LayoutAdmin>
      <PlayFieldList arenaId={arenaId} />
    </LayoutAdmin>
  )
}

export default AdminFieldsPage
