import React from 'react'

import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'

import { Text } from '~/components/styled'
import { normalizeImageSrc } from '~/helpers/string'
import type { IUser } from '~/server-side/useCases/user/user.dto'

export type PartnerProps = IUser & {
  onConfirm?: (id?: string) => any
  onDelete?: (id?: string) => any
  divider?: boolean
}
export const Partner: React.FC<PartnerProps> = ({ id, name, nick, email, image, onDelete, onConfirm, divider }) => {
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

  const handleConfirm = () => {
    if (onConfirm) onConfirm(id)
  }

  return (
    <ListItem
      divider={!!divider}
      disablePadding
      secondaryAction={
        <Stack direction={'row'} justifyContent="end">
          {onDelete ? (
            <IconButton size="large" onClick={handleDelete} disabled={!onDelete}>
              <Tooltip title="Remover dupla" arrow>
                <DeleteIcon />
              </Tooltip>
            </IconButton>
          ) : null}
          {onConfirm ? (
            <IconButton size="large" onClick={handleConfirm} disabled={!onConfirm}>
              <Tooltip title="Confirmar dupla" arrow>
                <CheckCircleIcon />
              </Tooltip>
            </IconButton>
          ) : null}
        </Stack>
      }
    >
      <ListItemAvatar>
        <Avatar alt={name} src={normalizeImageSrc(image)} />
      </ListItemAvatar>
      <ListItemText primary={renderPrimaryText()} secondary={renderSecondaryText(email)} />
    </ListItem>
  )
}
