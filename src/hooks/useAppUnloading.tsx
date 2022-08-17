import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { setAuth } from '~/store/reducers/auth'

export function useAppUnloading() {
  const dispatch = useDispatch()
  const unloading = useCallback(() => {
    dispatch(setAuth({ loading: false }))
  }, [dispatch])
  return [unloading]
}
