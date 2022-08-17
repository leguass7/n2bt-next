import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'

import { getMe } from '~/services/api/user'
import { AppStoreState } from '~/store'
import { clearAuth, setAuth } from '~/store/reducers/auth'

export function useAppAuth() {
  const dispatch = useDispatch()
  const { status, data } = useSession()
  const [userError, setUserError] = useState('')
  const userName = useSelector<AppStoreState, string>(state => state?.auth?.userName || '')
  const userLevel = useSelector<AppStoreState, number>(state => state?.auth?.level || 0)
  const loadingUser = useSelector<AppStoreState, boolean>(state => !!state?.auth?.loading)

  const userData = useMemo(() => {
    return data ? { ...data, userName, userLevel } : null
  }, [data, userName, userLevel])

  const [loading, authenticated] = useMemo(() => {
    return [!!(loadingUser || status === 'loading'), !!(status === 'authenticated')]
  }, [loadingUser, status])

  const completedAuth = useMemo(() => {
    return !!(authenticated && userName && !loading)
  }, [authenticated, userName, loading])

  const updateAppAuth = useCallback(
    async (data: Partial<AppStoreState['auth']> = {}) => {
      dispatch(setAuth({ ...data }))
    },
    [dispatch]
  )

  const lougOut = useCallback(async () => {
    dispatch(clearAuth())
    signOut()
  }, [dispatch])

  const requestMe = useCallback(async () => {
    updateAppAuth({ loading: true })
    const response = await getMe()
    updateAppAuth({
      loading: false,
      level: response?.user?.level,
      userName: response?.user?.name
    })
    if (!response?.success) {
      toast.error(response?.message || 'Erro de autenticação')
      setUserError(`${response?.message}`)
    } else {
      setUserError(null)
    }
    return response
  }, [updateAppAuth])

  useEffect(() => {
    if (!loading && authenticated && !userData && !userError) {
      requestMe().then(res => {
        if (res && !res?.success) toast.warn(data?.user?.name || 'no user')
      })
    }
  }, [requestMe, authenticated, userData, loading, data, userError])

  return { loading, lougOut, completedAuth, updateAppAuth, requestMe, authenticated, data }
}
