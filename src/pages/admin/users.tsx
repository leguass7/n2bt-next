import React from 'react'

import Card from '@mui/material/Card'
import type { NextPage } from 'next'

import { TableUsers } from '~/components/admin/TableUsers'
import { LayoutAdmin } from '~/components/app/LayoutAdmin'

const AdminUsersPage: NextPage = () => {
  return (
    <LayoutAdmin>
      <Card>
        <TableUsers />
      </Card>
    </LayoutAdmin>
  )
}

export default AdminUsersPage
