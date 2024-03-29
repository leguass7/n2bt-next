import React, { useEffect } from 'react'

import { useRouter } from 'next/router'

import { useAppAuth } from '~/hooks/useAppAuth'

type Props = {
  children?: React.ReactNode
}

export const LayoutPrint: React.FC<Props> = ({ children }) => {
  const { logOut, completedAuth, userData, loading } = useAppAuth()
  const { push } = useRouter()

  useEffect(() => {
    if (!completedAuth && !loading) push('/')
    else if (userData?.level < 8) {
      logOut()
    }
  }, [push, completedAuth, logOut, userData, loading])

  return <>{children}</>
}
