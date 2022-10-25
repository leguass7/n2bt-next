import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { Button, Grid } from '@mui/material'
import { useRouter } from 'next/router'

import { CircleLoading } from '~/components/CircleLoading'
import { SimpleModal } from '~/components/Common/SimpleModal'
import { AllowContactModal } from '~/components/Modals/AllowContactModal'
import { useAppAuth } from '~/hooks/useAppAuth'
import { useIsMounted } from '~/hooks/useIsMounted'
import { useOnceCall } from '~/hooks/useOnceCall'
import { IUser } from '~/server-side/useCases/user/user.dto'
import { updateUser } from '~/services/api/user'

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
      {!forbidden ? <AllowContactModal /> : null}
      {loading ? <CircleLoading /> : null}
    </>
  )
}
