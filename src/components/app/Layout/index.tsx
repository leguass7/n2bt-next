import React from 'react'

import { LayoutAppBar } from './LayoutAppBar'
import { LayoutProvider } from './LayoutProvider'
import { LayoutContainer } from './styles'

type LayoutProps = {
  children?: React.ReactNode
}
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <LayoutProvider>
      <LayoutAppBar />
      <LayoutContainer>{children}</LayoutContainer>
    </LayoutProvider>
  )
}
