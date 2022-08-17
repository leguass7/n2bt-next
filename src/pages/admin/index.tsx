import React from 'react'

import { NextPage } from 'next'

import { LayoutAdmin } from '~/components/app/LayoutAdmin'

const AdminIndexPage: NextPage = () => {
  return (
    <LayoutAdmin>
      <div>
        <h1>Admin</h1>
      </div>
    </LayoutAdmin>
  )
}

export default AdminIndexPage
