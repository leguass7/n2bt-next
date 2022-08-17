import React from 'react'

import { useAppUnloading } from '~/hooks/useAppUnloading'
import { useOnceCall } from '~/hooks/useOnceCall'

import { ThemeProvider } from './Provider'
import { ThemeProviderProps } from './types'

export const AppThemeProvider: React.FC<ThemeProviderProps> = ({ children, themeName }) => {
  const [unloading] = useAppUnloading()

  useOnceCall(() => {
    unloading()
  })

  return <ThemeProvider themeName={themeName}>{children}</ThemeProvider>
}
