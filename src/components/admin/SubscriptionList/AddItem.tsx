import React, { useCallback, useState } from 'react'

import { Grid, Card, CardContent, Divider, CardActions, Stack, Button, Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material'

import { useAppTheme } from '~/components/AppThemeProvider/useAppTheme'
import { SearchFetchHandler, SearchUserDrawer, SelectHandler } from '~/components/SearchUserDrawer'
import { Text } from '~/components/styled'
import { normalizeImageSrc, stringAvatar } from '~/helpers/string'
import { ISubscription } from '~/server-side/useCases/subscriptions/subscriptions.dto'
import type { IUser } from '~/server-side/useCases/user/user.dto'
import { findUser } from '~/services/api/user'

type Searching = 'user' | 'partner' | null
type Props = {
  categoryId: number
  tournamentId: number
}
export const AddItem: React.FC<Props> = ({ categoryId, tournamentId }) => {
  const [data, setData] = useState<Partial<ISubscription>>(null)
  const [searching, setSearching] = useState<Searching>(null)
  const { theme, isMobile } = useAppTheme()

  const updateState = (d: Partial<ISubscription> = {}) => {
    setData(old => ({ ...old, ...d }))
  }

  const handleSelect: SelectHandler = (userId, userData) => {
    const user = { ...userData, id: userId } as IUser
    const update: Partial<ISubscription> = { [searching]: user }
    if (searching === 'user') update.userId = userId
    if (searching === 'partner') update.partnerId = userId
    updateState({ categoryId, ...update })
  }

  const fetcher: SearchFetchHandler = useCallback(async data => {
    const response = await findUser(data)
    return response
  }, [])

  const toogleClose = (type?: Searching) => {
    return () => {
      setSearching(type || null)
    }
  }

  const renderName = (name = '', nick = '', email = '') => {
    const limit = isMobile ? 20 : 27
    const len = name.length
    if (len > limit) {
      return (
        <Text title={email}>
          <>{nick ? <>{`${nick} ${name.substring(0, limit - 10)}...`}</> : <>{`${name.substring(0, limit)}...`}</>}</>
        </Text>
      )
    }

    return <Text title={email}>{name}</Text>
  }

  return (
    <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
      <Card sx={{ backgroundColor: theme.colors.secondary }}>
        <CardContent sx={{ padding: 1, minHeight: 130 }}>
          <List disablePadding>
            {!data && !data?.user ? (
              <Stack direction={'row'} spacing={1}>
                <Button size="small" onClick={() => setSearching('user')}>
                  Adicionar usuário
                </Button>
              </Stack>
            ) : (
              <ListItem disablePadding>
                <ListItemAvatar>
                  <Avatar key={`add1-${data?.userId}`} alt={data?.user?.name} src={normalizeImageSrc(data?.user?.image)}>
                    {stringAvatar(data?.user?.name)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={renderName(data?.user?.name, data?.user?.nick, data?.user?.email)}
                  sx={{ paddingLeft: 1 }}
                  secondary={data?.user?.email || '--'}
                />
              </ListItem>
            )}
            {!data?.partner ? (
              <Stack direction={'row'} spacing={1}>
                <Button size="small" onClick={() => setSearching('partner')}>
                  Adicionar parceiro
                </Button>
              </Stack>
            ) : (
              <ListItem disablePadding>
                <ListItemAvatar>
                  <Avatar key={`add2-${data?.partnerId}`} alt={data?.partner?.name} src={normalizeImageSrc(data?.partner?.image)}>
                    {stringAvatar(data?.partner?.name || '')}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={renderName(data?.partner?.name, data?.partner?.nick, data?.partner?.email)}
                  sx={{ paddingLeft: 1 }}
                  secondary={data?.partner?.email || '--'}
                />
              </ListItem>
            )}
          </List>
        </CardContent>
        <Divider />
        <CardActions>valor, pago, botao salvar</CardActions>
      </Card>
      <SearchUserDrawer
        open={!!searching}
        fetcher={fetcher}
        onClose={toogleClose(null)}
        fixedFilter={{ categoryId, tournamentId }}
        onSelect={handleSelect}
      />
    </Grid>
  )
}
