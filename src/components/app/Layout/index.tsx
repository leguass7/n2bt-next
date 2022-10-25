import React, { useEffect, useMemo } from 'react'

import { useRouter } from 'next/router'

import { CircleLoading } from '~/components/CircleLoading'
import { AllowContactModal } from '~/components/Modals/AllowContactModal'
import { useAppAuth } from '~/hooks/useAppAuth'

import { LayoutAppBar } from './LayoutAppBar'
import { LayoutProvider } from './LayoutProvider'
import { Menu } from './Menu'
import { LayoutContainer } from './styles'

type LayoutProps = {
  children?: React.ReactNode
  isProtected?: boolean
}

export const Layout: React.FC<LayoutProps> = ({ children, isProtected }) => {
  const { push } = useRouter()
  const { authenticated, loading } = useAppAuth()

  const forbidden = useMemo(() => !!isProtected && !authenticated && !loading, [isProtected, authenticated, loading])

  useEffect(() => {
    if (forbidden) push('/login')
  }, [push, forbidden])

  return (
    <>
      <LayoutProvider>
        <LayoutAppBar />
        <LayoutContainer>{!loading ? children : null}</LayoutContainer>
        <Menu />
      </LayoutProvider>
      {/* {!forbidden ? <AllowContactModal /> : null} */}
      {loading ? <CircleLoading /> : null}
    </>
  )
}
