import { useCallback, useEffect, useMemo, useState } from 'react'

import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import styled from 'styled-components'

import { stringAvatar } from '~/helpers/string'
import { useIsMounted } from '~/hooks/useIsMounted'
import { IRanking } from '~/server-side/useCases/ranking/ranking.dto'
import { listRankings } from '~/services/api/ranking'

import { useAppTheme } from '../AppThemeProvider/useAppTheme'

interface Props {
  categoryId: number
  tournamentId: number
}

export const RankingList: React.FC<Props> = ({ categoryId, tournamentId }) => {
  const { theme } = useAppTheme()

  const [data, setData] = useState<IRanking[]>([])

  const [loading, setLoading] = useState(false)
  const isMounted = useIsMounted()

  const fetchData = useCallback(async () => {
    if (!categoryId || !tournamentId) return null
    setLoading(true)
    if (isMounted()) {
      setLoading(false)
      const { success, rankings } = await listRankings(categoryId)
      if (success) setData(rankings)
    }
  }, [isMounted, categoryId, tournamentId])

  const users = useMemo(() => {
    if (!data?.length) return []
    return data.map(({ user }) => {
      if (user?.id) return user
    })
  }, [data])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) return null

  return (
    <>
      <List>
        {users?.length
          ? users.map(({ image, name, id, nick }, i) => {
              return (
                <ListItem key={`user-${id}`}>
                  <ListItemAvatar>
                    <Avatar src={image}>{stringAvatar(name)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText secondary={nick || ' '}>
                    <Typography variant="h6">{name}</Typography>
                  </ListItemText>
                  <ListItemAvatar>
                    {i < 3 ? (
                      <>
                        <CustomBadge overlap="circular" anchorOrigin={{ horizontal: 'right', vertical: 'top' }} badgeContent={i + 1}>
                          <EmojiEventsIcon htmlColor={theme.colors.primary} sx={{ fontSize: 48 }}>
                            1
                          </EmojiEventsIcon>
                        </CustomBadge>
                      </>
                    ) : (
                      <Avatar sx={{ backgroundColor: theme.colors.primary }}>{i + 1}</Avatar>
                    )}
                  </ListItemAvatar>
                </ListItem>
              )
            })
          : null}
      </List>
    </>
  )
}

const CustomBadge = styled(Badge)`
  span {
    background-color: #fff;
    color: #222;
  }
`
