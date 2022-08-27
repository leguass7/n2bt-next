import React, { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'

import { createContext, useContextSelector } from 'use-context-selector'

import { useAppArena } from '~/hooks/useAppArena'
import type { AppStoreState } from '~/store'
import type { IArenaAppState } from '~/store/reducers/arena'

export interface ILayoutAdminContext {
  tournamentId?: number
  setTournamentId: React.Dispatch<React.SetStateAction<number>>
  arenaId?: number
  setArenaId: (id?: number) => void
  menuOpen: boolean
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const LayoutAdminContext = createContext({} as ILayoutAdminContext)

type Props = {
  children?: React.ReactNode
}
export const LayoutAdminProvider: React.FC<Props> = ({ children }) => {
  const { updateAppArena, arenaId } = useAppArena()
  const [menuOpen, setMenuOpen] = useState(false)
  const [tournamentId, setTournamentId] = useState(0)

  const setArenaId = useCallback(
    (id = 0) => {
      updateAppArena({ arenaId: id })
    },
    [updateAppArena]
  )
  return (
    <LayoutAdminContext.Provider value={{ arenaId, setArenaId, menuOpen, setMenuOpen, tournamentId, setTournamentId }}>
      {children}
    </LayoutAdminContext.Provider>
  )
}

export function useAdminMenu(): [ILayoutAdminContext['menuOpen'], ILayoutAdminContext['setMenuOpen']] {
  const menuOpen = useContextSelector(LayoutAdminContext, ({ menuOpen }) => !!menuOpen)
  const setMenuOpen = useContextSelector(LayoutAdminContext, ({ setMenuOpen }) => setMenuOpen)
  return [menuOpen, setMenuOpen]
}

export function useAdminArena(): [ILayoutAdminContext['arenaId'], ILayoutAdminContext['setArenaId'], IArenaAppState['options']] {
  const arenas = useSelector<AppStoreState, IArenaAppState['options']>(state => state?.arena?.options || [])
  const arenaId = useContextSelector(LayoutAdminContext, ({ arenaId }) => arenaId)
  const setArenaId = useContextSelector(LayoutAdminContext, ({ setArenaId }) => setArenaId)

  return [arenaId, setArenaId, arenas]
}

export function useAdminTournament(): [ILayoutAdminContext['tournamentId'], ILayoutAdminContext['setTournamentId']] {
  const [tournamentId, setTournamentId] = useContextSelector(LayoutAdminContext, ({ tournamentId, setTournamentId }) => [
    tournamentId,
    setTournamentId
  ])
  return [tournamentId, setTournamentId]
}
