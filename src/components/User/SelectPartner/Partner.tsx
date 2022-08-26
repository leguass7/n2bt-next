import React from 'react'

import DeleteIcon from '@mui/icons-material/Delete'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Tooltip from '@mui/material/Tooltip'

import { Text } from '~/components/styled'
import { normalizeImageSrc } from '~/helpers/string'
import type { IUser } from '~/server-side/useCases/user/user.dto'

export type PartnerProps = IUser & {
  onDelete?: (id?: string) => any
}
export const Partner: React.FC<PartnerProps> = ({ id, name, nick, email, image, onDelete }) => {
  const renderSecondaryText = (email: string) => {
    return <Text>{email}</Text>
  }

  const renderPrimaryText = () => {
    return (
      <Text>
        {nick ? `(${nick})` : ''} <Text textSize={12}>{name}</Text>
      </Text>
    )
  }

  const handleDelete = () => {
    if (onDelete) onDelete(id)
  }

  return (
    <ListItem
      divider
      disablePadding
      secondaryAction={
        <Tooltip title="Remover dupla" arrow>
          <IconButton size="large" onClick={handleDelete} disabled={!onDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      }
    >
      <ListItemAvatar>
        <Avatar alt={name} src={normalizeImageSrc(image)} />
      </ListItemAvatar>
      <ListItemText primary={renderPrimaryText()} secondary={renderSecondaryText(email)} />
    </ListItem>
  )
}
