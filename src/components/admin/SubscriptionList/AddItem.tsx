import React, { useCallback, useState } from 'react'
import { toast } from 'react-toastify'

import SaveIcon from '@mui/icons-material/Save'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'

import { useAppTheme } from '~/components/AppThemeProvider/useAppTheme'
import { SearchFetchHandler, SearchUserDrawer, SelectHandler } from '~/components/SearchUserDrawer'
import { FlexContainer, Text } from '~/components/styled'
import { normalizeImageSrc, stringAvatar } from '~/helpers/string'
import { ISubscription } from '~/server-side/useCases/subscriptions/subscriptions.dto'
import type { IUser } from '~/server-side/useCases/user/user.dto'
import { createPairSubscription } from '~/services/api/subscriptions'
import { findUser } from '~/services/api/user'

type SuccessHandler = (subscriptionId?: number) => any
type Searching = 'user' | 'partner' | null
type Props = {
  categoryId: number
  tournamentId: number
  onSuccess?: SuccessHandler
}
export const AddItem: React.FC<Props> = ({ categoryId, tournamentId, onSuccess }) => {
  const [loading, setLoading] = useState(false)
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

  const handleChangeText: React.ChangeEventHandler<HTMLInputElement> = e => {
    const v = e.target?.value
    const v1 = Number(v) || 0
    if (v1) {
      updateState({ value: v1 })
    }
  }

  const handleChangePaid = (e, chk?: boolean) => {
    updateState({ paid: !!chk })
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

  const handleSave = useCallback(async () => {
    setLoading(true)
    const response = await createPairSubscription(data)
    if (response?.success) {
      toast.success('Inscrição incluída com sucesso')
      if (onSuccess) onSuccess(response?.subscriptionId)
    } else {
      toast.error(response?.message || 'Erro ao salvar inscrição')
    }
    setLoading(false)
  }, [data, onSuccess])

  return (
    <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
      <Card sx={{ backgroundColor: theme.colors.secondary }}>
        <CardContent sx={{ padding: 1, minHeight: 130 }}>
          <List disablePadding>
            {data?.user ? (
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
            ) : null}
            {data?.partner ? (
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
            ) : null}

            {!data?.user ? (
              <Stack direction={'row'} spacing={1}>
                <Button size="small" onClick={() => setSearching('user')}>
                  Adicionar usuário
                </Button>
              </Stack>
            ) : null}
            {!data?.partner ? (
              <Stack direction={'row'} spacing={1}>
                <Button size="small" onClick={() => setSearching('partner')}>
                  Adicionar parceiro
                </Button>
              </Stack>
            ) : null}
          </List>
        </CardContent>
        <Divider />
        <CardActions>
          <FlexContainer>
            <input type="text" name="value" maxLength={5} onChange={handleChangeText} disabled={!!loading} />
            <Switch name="paid" size="small" onChange={handleChangePaid} checked={!!data?.paid} disabled={!!loading} />
            <IconButton size="small" disabled={!!loading} onClick={handleSave}>
              <SaveIcon />
            </IconButton>
          </FlexContainer>
        </CardActions>
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
