import React, { useCallback, useState } from 'react'

import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'

import { CircleLoading } from '~/components/CircleLoading'
import { useOnceCall } from '~/hooks/useOnceCall'
import { listRankings } from '~/services/api/ranking'

export const Item: React.FC = () => {
  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
        </ListItemAvatar>
        <ListItemText
          primary="Brunch this weekend?"
          secondary={
            <React.Fragment>
              <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary">
                Ali Connors
              </Typography>
              {" — I'll be in your neighborhood doing errands this…"}
            </React.Fragment>
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  )
}

type Props = {
  tournamentId: number
  categoryId: number
}
export const RankingList: React.FC<Props> = ({ categoryId }) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])

  const fetchData = useCallback(async () => {
    setLoading(true)
    const result = await listRankings(categoryId)
    setLoading(false)
    if (result?.success) {
      setData(result?.rankings || [])
    }
  }, [categoryId])

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
