import React from 'react'

import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'

import { useAppTheme } from '~/components/AppThemeProvider/useAppTheme'
import { Text } from '~/components/styled'
import { normalizeImageSrc, stringAvatar } from '~/helpers/string'

import type { PreparedSubscription } from './utils'

export type ItemSubscriptionProps = PreparedSubscription & {
  onClickPix?: (paymentId: number) => void
  updateListHandler?: () => void
  manualPaidHandler?: (paymentId: number) => void
}

export const ItemSubscription: React.FC<ItemSubscriptionProps> = ({ id, user, partner, createdBy, userId }) => {
  const { isMobile } = useAppTheme()
  const renderAvatar = () => {
    return [
      <Avatar key={`1-${user?.id}`} alt={user?.name} src={normalizeImageSrc(user?.image)}>
        {stringAvatar(user?.name)}
      </Avatar>,
      <Avatar key={`2-${user?.id}`} alt={partner?.name} src={normalizeImageSrc(partner?.image)}>
        {stringAvatar(partner?.name)}
      </Avatar>
    ]
  }

  const renderName = (name = '', nick = '') => {
    const limit = isMobile ? 20 : 27
    const len = name.length
    if (len > limit) {
      return (
        <Text>
          <>{nick ? <>{`${nick} ${name.substring(0, limit - 10)}...`}</> : <>{`${name.substring(0, limit)}...`}</>}</>
        </Text>
      )
    }

    return <Text>{name}</Text>
  }

  return (
    <>
      <List disablePadding>
        <ListItem
          disablePadding
          secondaryAction={
            <>
              {createdBy !== userId ? (
                <IconButton title={`Deletar inscrição '${id}'`} disabled>
                  <DeleteForeverIcon />
                </IconButton>
              ) : null}
            </>
          }
        >
          <ListItemAvatar>
            <AvatarGroup spacing="small" max={2} total={2}>
              {renderAvatar()}
            </AvatarGroup>
          </ListItemAvatar>
          <ListItemText primary={renderName(user?.name)} secondary={renderName(partner?.name)} sx={{ paddingLeft: 1 }} />
        </ListItem>
      </List>
    </>
  )
}
