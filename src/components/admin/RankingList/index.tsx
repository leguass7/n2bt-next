import React, { useCallback, useState } from 'react'

import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material'

import type { TableFetchParams } from '~/components/CustomTable/types'

type Props = {
  tournamentId: number
}
export const RankingList: React.FC<Props> = ({ tournamentId }) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])

  const fetchData = useCallback(
    async (pagination?: TableFetchParams) => {
      setLoading(true)
      const result = await paginateTournaments(arenaId, pagination)
      setLoading(false)
      if (result?.success) {
        setData(result?.ranking || [])
      }
    },
    [tournamentId]
  )

  return (
    <List sx={{ width: '100%' }}>
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
    </List>
  )
}
