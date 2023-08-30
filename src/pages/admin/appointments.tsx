import { type NextPage } from 'next'

import { AppointmentPanel } from '~/components/admin/Appointment/AppointmentPanel'
import { LayoutAdmin } from '~/components/app/LayoutAdmin'

interface Props {
  children?: React.ReactNode
}

const AdminAppointmentPage: NextPage<Props> = () => {
  return (
    <LayoutAdmin>
      <AppointmentPanel />
    </LayoutAdmin>
  )
}

export default AdminAppointmentPage
