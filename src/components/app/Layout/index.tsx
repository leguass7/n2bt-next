import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { Button, Grid } from '@mui/material'
import { useRouter } from 'next/router'

import { CircleLoading } from '~/components/CircleLoading'
import { SimpleModal } from '~/components/Common/SimpleModal'
import { useAppAuth } from '~/hooks/useAppAuth'
import { useIsMounted } from '~/hooks/useIsMounted'
import { useOnceCall } from '~/hooks/useOnceCall'
import { IUser } from '~/server-side/useCases/user/user.dto'
import { updateUser } from '~/services/api/user'

import { LayoutAppBar } from './LayoutAppBar'
import { LayoutProvider } from './LayoutProvider'
import { Menu } from './Menu'
import { LayoutContainer } from './styles'

type LayoutProps = {
  children?: React.ReactNode
  isProtected?: boolean
}

export const Layout: React.FC<LayoutProps> = ({ children, isProtected }) => {
  const { push } = useRouter()
  const { authenticated, loading, requestMe, updateAppAuth } = useAppAuth()
  const isMounted = useIsMounted()
  const [data, setData] = useState<IUser>({})

  const getMe = useCallback(async () => {
    const { success, user = {} } = await requestMe()
    if (isMounted() && success) setData(user)
  }, [isMounted, requestMe])

  const forbidden = useMemo(() => !!isProtected && !authenticated && !loading, [isProtected, authenticated, loading])

  useOnceCall(getMe, !forbidden)

  useEffect(() => {
    if (forbidden) push('/login')
  }, [push, forbidden])

  const handleClick = (allow: boolean) => async () => {
    const id = data?.id
    if (!id) return

    await updateUser(data.id, { allowedContact: !!allow }).then(({ success }) => {
      if (success) updateAppAuth({ allowedContact: !!allow })
      getMe()
    })
  }

  return (
    <>
      <LayoutProvider>
        <LayoutAppBar />
        <LayoutContainer>{!loading ? children : null}</LayoutContainer>
        <Menu />
      </LayoutProvider>
      {!forbidden ? (
        <SimpleModal
          open={data?.allowedContact === null}
          onToggle={() => handleClick(false)}
          title="Deseja ser notificado quando houver outro torneio?"
        >
          <Grid container justifyContent="center" pt={2} alignItems="center">
            <Button onClick={handleClick(false)} variant="outlined" sx={{ mr: 2 }}>
              Não
            </Button>

            <Button onClick={handleClick(true)} variant="contained">
              Sim
            </Button>
          </Grid>
        </SimpleModal>
      ) : null}
      {loading ? <CircleLoading /> : null}
    </>
  )
}
