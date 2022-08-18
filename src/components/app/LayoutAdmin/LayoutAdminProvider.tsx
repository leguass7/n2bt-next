import React, { useState } from 'react'

import { createContext, useContextSelector } from 'use-context-selector'

export interface ILayoutAdminContext {
  arenaId?: number
  setArenaId: React.Dispatch<React.SetStateAction<number>>
  menuOpen: boolean
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const LayoutAdminContext = createContext({} as ILayoutAdminContext)

// import { Container } from './styles';
type Props = {
  children?: React.ReactNode
}
export const LayoutAdminProvider: React.FC<Props> = ({ children }) => {
  const [arenaId, setArenaId] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  return <LayoutAdminContext.Provider value={{ arenaId, setArenaId, menuOpen, setMenuOpen }}>{children}</LayoutAdminContext.Provider>
}

export function useAdminMenu(): [ILayoutAdminContext['menuOpen'], ILayoutAdminContext['setMenuOpen']] {
  const menuOpen = useContextSelector(LayoutAdminContext, ({ menuOpen }) => !!menuOpen)
  const setMenuOpen = useContextSelector(LayoutAdminContext, ({ setMenuOpen }) => setMenuOpen)
  return [menuOpen, setMenuOpen]
}
