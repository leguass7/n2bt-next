import React from 'react'

import CheckIcon from '@mui/icons-material/Check'
import ImportExportIcon from '@mui/icons-material/ImportExport'
import VerifiedIcon from '@mui/icons-material/Verified'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'

import { Text } from '~/components/styled'
import { compareValues } from '~/helpers/array'
import { normalizeImageSrc } from '~/helpers/string'
import type { IUser } from '~/server-side/useCases/user/user.dto'

type Props = IUser & {
  hasIn?: boolean
  tournamentId?: number
  categoryId?: number
  onClickItem?: (id: string) => void
}
export const Item: React.FC<Props> = ({
  id,
  name,
  nick,
  email,
  completed,
  image,
  onClickItem,
  userSubscriptions = [],
  categoryId,
  tournamentId,
  hasIn
}) => {
  const subscriptions = userSubscriptions.sort(compareValues('id', 'desc'))

  const hasCategory = categoryId && subscriptions.find(f => f.categoryId === categoryId)
  const hasTournament = tournamentId && subscriptions.find(f => f.category?.tournament?.id === tournamentId)
  const hasPaid = !!subscriptions.find(f => !!f.paid)

  const verified = !!(hasPaid && completed)

  const renderSecondaryText = (email: string) => {
    const firstCat = () => {
      if (!hasCategory?.category?.title) {
        return subscriptions.find(f => !!f?.category?.title)?.category?.title
      }
      return hasCategory?.category?.title
    }
    return (
      <Text>
        {email}
        {hasTournament || hasCategory ? (
          <>
            <br />
            <Text textSize={12}>
              {hasTournament?.category?.tournament?.title} - {firstCat()}
            </Text>
          </>
        ) : null}
      </Text>
    )
  }

  const renderPrimaryText = () => {
    return (
      <Text>
        {nick ? `(${nick})` : ''} {name}
      </Text>
    )
  }

  return (
    <ListItem
      disablePadding
      secondaryAction={
        <Toolbar>
          {verified ? (
            <Tooltip title="Conta verificada" arrow>
              <VerifiedIcon fontSize="small" />
            </Tooltip>
          ) : null}
          {hasIn ? (
            <Tooltip title="Já adicionado" arrow>
              <CheckIcon fontSize="small" />
            </Tooltip>
          ) : (
            <Tooltip title="selecionar usuário" arrow>
              <IconButton onClick={() => onClickItem(id)}>
                <ImportExportIcon />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
      }
    >
      <ListItemAvatar>
        <Avatar alt={name} src={normalizeImageSrc(image)} />
      </ListItemAvatar>
      <ListItemText primary={renderPrimaryText()} secondary={renderSecondaryText(email)} />
    </ListItem>
  )
}
