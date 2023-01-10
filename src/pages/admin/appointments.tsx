import { NextPage } from 'next'

import { LayoutAdmin } from '~/components/app/LayoutAdmin'

interface Props {
  children?: React.ReactNode
}

const AdminAppointmentPage: NextPage<Props> = () => {
  return <LayoutAdmin>Página de agendamentos</LayoutAdmin>
}

export default AdminAppointmentPage
