import React, { useEffect } from 'react'

import { useRouter } from 'next/router'

import { CircleLoading } from '~/components/CircleLoading'
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

  useEffect(() => {
    if (!!isProtected && !authenticated && !loading) push('/login')
  }, [authenticated, loading, push, isProtected])

  return (
    <>
      <LayoutProvider>
        <LayoutAppBar />
        <LayoutContainer>{!loading ? children : null}</LayoutContainer>
        <Menu />
      </LayoutProvider>
      {loading ? <CircleLoading /> : null}
    </>
  )
}
