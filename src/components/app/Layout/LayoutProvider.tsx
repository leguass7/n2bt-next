import React, { useState } from 'react'

import { createContext, useContextSelector } from 'use-context-selector'

export interface ILayoutContext {
  menuOpen: boolean
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const LayoutContext = createContext({} as ILayoutContext)

type Props = {
  children?: React.ReactNode
}
export const LayoutProvider: React.FC<Props> = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false)

  return <LayoutContext.Provider value={{ menuOpen, setMenuOpen }}>{children}</LayoutContext.Provider>
}

export function useMenu(): [ILayoutContext['menuOpen'], ILayoutContext['setMenuOpen']] {
  const menuOpen = useContextSelector(LayoutContext, ({ menuOpen }) => !!menuOpen)
  const setMenuOpen = useContextSelector(LayoutContext, ({ setMenuOpen }) => setMenuOpen)
  return [menuOpen, setMenuOpen]
}
