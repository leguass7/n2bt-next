import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { signIn, useSession } from 'next-auth/react'
import { signOut, SignInResponse } from 'next-auth/react'

import { getMe } from '~/services/api/me'
import { AppStoreState } from '~/store'
import { clearAuth, setAuth } from '~/store/reducers/auth'

export interface PayloadSignin {
  email: string
  password: string
}

export type { SignInResponse }

export function useAppAuth() {
  const dispatch = useDispatch()
  const { status, data } = useSession()
  const nick = useSelector<AppStoreState, string>(state => state?.auth?.nick || '')
  const level = useSelector<AppStoreState, number>(state => state?.auth?.level || 0)
  const completed = useSelector<AppStoreState, boolean>(state => !!state?.auth?.completed)
  const loadingUser = useSelector<AppStoreState, boolean>(state => !!state?.auth?.loading)

  const userData = useMemo(() => {
    const { user = {}, ...rest } = data || {}
    return data && nick && level ? { ...user, ...rest, nick, level, completed } : null
  }, [data, nick, level, completed])

  const [loading, authenticated] = useMemo(() => {
    return [!!(loadingUser || status === 'loading'), !!(status === 'authenticated')]
  }, [loadingUser, status])

  const completedAuth = useMemo(() => {
    return !!(authenticated && !loading && userData)
  }, [authenticated, userData, loading])

  const updateAppAuth = useCallback(
    async (data: Partial<AppStoreState['auth']> = {}) => {
      dispatch(setAuth(data))
    },
    [dispatch]
  )

  const logOut = useCallback(async () => {
    dispatch(clearAuth())
    return signOut({ callbackUrl: '/login' })
  }, [dispatch])

  const requestMe = useCallback(async () => {
    updateAppAuth({ loading: true })
    const response = await getMe()
    let uData = {}
    if (response?.success) {
      uData = {
        loading: false,
        level: response?.user?.level,
        nick: response?.user?.name,
        completed: response?.user?.completed,
        error: null
      }
    } else {
      toast.error(response?.message || 'Erro de autenticação')
      uData = { error: `${response?.message}` }
    }
    updateAppAuth({ loading: false, ...uData })

    return response
  }, [updateAppAuth])

  const authorize = useCallback(
    async ({ email, password }: PayloadSignin) => {
      updateAppAuth({ loading: true })
      const response = await signIn('custom', { email, password, redirect: false })
      if (response?.status === 401) {
        updateAppAuth({ loading: false })
        toast.error('E-mail/senha não autorizados')
      } else {
        await requestMe()
      }
      return response
    },
    [requestMe, updateAppAuth]
  )

  return { loading, logOut, completedAuth, updateAppAuth, requestMe, authenticated, userData, authorize }
}

export function useAppRecoverCode(): [string, (code?: string) => void] {
  const dispatch = useDispatch()
  const recoverCode = useSelector<AppStoreState, string>(state => state?.auth?.recoverCode || '')

  const setRecoverCode = useCallback(
    (code?: string) => {
      dispatch(setAuth({ recoverCode: code }))
    },
    [dispatch]
  )
  return [recoverCode, setRecoverCode]
}
