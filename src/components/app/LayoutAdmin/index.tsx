import React, { useEffect } from 'react'

import { useRouter } from 'next/router'

import { useAppAuth } from '~/hooks/useAppAuth'

import { AdminAppBar } from './AdminAppBar'
import { DrawerMenu } from './DrawerMenu'
import { LayoutAdminProvider } from './LayoutAdminProvider'
import { LayoutContainer } from './styles'

type LayoutAdminProps = {
  children?: React.ReactNode
}

export const LayoutAdmin: React.FC<LayoutAdminProps> = ({ children }) => {
  const { logOut, completedAuth, userData, loading } = useAppAuth()
  const { push } = useRouter()

  useEffect(() => {
    if (!completedAuth && !loading) push('/')
    else if (userData?.level < 8) {
      logOut()
    }
  }, [push, completedAuth, logOut, userData, loading])

  return (
    <LayoutAdminProvider>
      <AdminAppBar />
      <LayoutContainer>{children}</LayoutContainer>
      <DrawerMenu />
    </LayoutAdminProvider>
  )
}
