import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { getArena, listArenas } from '~/services/api/arena'
import type { AppStoreState } from '~/store'
import { clearArena, IArenaAppState, setArena } from '~/store/reducers/arena'

export function useAppArena() {
  const dispatch = useDispatch()
  const loading = useSelector<AppStoreState, boolean>(state => !!state?.arena?.loading)
  const arenas = useSelector<AppStoreState, IArenaAppState['options']>(state => state?.arena?.options || [])
  const arenaId = useSelector<AppStoreState, IArenaAppState['arenaId']>(state => state?.arena?.arenaId || 0)

  const updateAppArena = useCallback(
    async (data: Partial<AppStoreState['arena']> = {}) => {
      dispatch(setArena(data))
    },
    [dispatch]
  )

  const clear = useCallback(async () => {
    dispatch(clearArena())
  }, [dispatch])

  const requestArena = useCallback(
    async (id: number) => {
      if (id) {
        updateAppArena({ loading: true })
        const response = await getArena(id)
        let uData = {}
        if (response?.success) {
          uData = {
            loading: false,
            arenaId: response?.arena?.id,
            name: response?.arena?.title,
            error: null
          }
        } else {
          toast.error(response?.message || 'Erro de autenticação')
          uData = { error: `${response?.message}` }
        }
        updateAppArena({ loading: false, ...uData })
        return response
      }
      return null
    },
    [updateAppArena]
  )

  const requestListArenas = useCallback(async () => {
    updateAppArena({ loading: true })
    const response = await listArenas()
    let uData = {}
    if (response?.success) {
      uData = {
        loading: false,
        options: response?.arenas || [],
        error: null
      }
    } else {
      toast.error(response?.message || 'Erro de autenticação')
      uData = { error: `${response?.message}` }
    }
    updateAppArena({ loading: false, ...uData })
    return response
  }, [updateAppArena])

  return { loading, requestArena, clear, updateAppArena, requestListArenas, arenas, arenaId }
}
