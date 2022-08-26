import React, { useCallback, useState } from 'react'

import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import { CircleLoading } from '~/components/CircleLoading'
import { normalizeImageSrc, stringAvatar } from '~/helpers/string'
import { useOnceCall } from '~/hooks/useOnceCall'
import type { IRanking } from '~/server-side/useCases/ranking/ranking.dto'
import { listRankings } from '~/services/api/ranking'

type ItemProps = IRanking & {}
export const Item: React.FC<ItemProps> = ({ id, user, category, points }) => {
  return (
    <>
      <ListItem
        alignItems="flex-start"
        secondaryAction={
          <Toolbar sx={{ justifyContent: 'flex-end' }}>
            <Tooltip title="Remover" arrow>
              <IconButton>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Alterar pontos" arrow>
              <IconButton>
                <EditIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        }
      >
        <ListItemAvatar>
          <Avatar alt={user?.name} src={normalizeImageSrc(user?.image)}>
            {stringAvatar(user?.name)}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={user?.name}
          secondary={
            <React.Fragment>
              <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary">
                {points} pontos
              </Typography>
              {` — ${category?.tournament?.title} ${category?.title}`}
            </React.Fragment>
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  )
}

export type OnFetchDataHandler = (ids: string[]) => any
type Props = {
  tournamentId: number
  categoryId: number
  onFetchData?: OnFetchDataHandler
}
export const RankingList: React.FC<Props> = ({ categoryId, onFetchData }) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])

  const fetchData = useCallback(async () => {
    setLoading(true)
    const result = await listRankings(categoryId)
    setLoading(false)
    if (result?.success) {
      setData(result?.rankings || [])
      if (onFetchData) onFetchData(result?.rankings?.map(f => f.userId) || [])
    }
  }, [categoryId, onFetchData])

  useOnceCall(fetchData)

  return (
    <>
      <List sx={{ width: '100%' }}>
        {data.map(ranking => {
          return <Item key={`item-${ranking?.id}`} {...ranking} />
        })}
      </List>
      {loading ? <CircleLoading /> : null}
    </>
  )
}
