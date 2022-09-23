import { useCallback, useEffect, useMemo, useState } from 'react'

import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import Typography from '@mui/material/Typography'
import styled from 'styled-components'

import { useAppTheme } from '~/components/AppThemeProvider/useAppTheme'
import { CircleLoading } from '~/components/CircleLoading'
import { getName, stringAvatar } from '~/helpers/string'
import { useIsMounted } from '~/hooks/useIsMounted'
import { ISubscription } from '~/server-side/useCases/subscriptions/subscriptions.dto'
import { listCategorySubscriptions } from '~/services/api/subscriptions'

interface Props {
  categoryId?: number
}

export const ListPartners: React.FC<Props> = ({ categoryId }) => {
  const [loading, setLoading] = useState(false)
  const isMounted = useIsMounted()
  const { theme } = useAppTheme()

  const [subscriptions, setSubscriptions] = useState<ISubscription[]>([])

  const fetchData = useCallback(async () => {
    if (!categoryId) return
    setLoading(true)

    const { success, subscriptions } = await listCategorySubscriptions(categoryId)
    if (isMounted()) {
      setLoading(false)
      if (success) setSubscriptions(subscriptions)
    }
  }, [isMounted, categoryId])

  const pairs = useMemo(() => {
    if (!subscriptions?.length) return []
    const alreadyPartner = []

    const partners = subscriptions.map(({ user, partner }) => {
      const found = alreadyPartner.find(id => id === user?.id)
      if (!found) {
        alreadyPartner.push(partner?.id)

        return [user, partner]
      }
    })

    return partners.filter(p => !!p)
  }, [subscriptions])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) return <CircleLoading />

  return (
    <ListContainer>
      {pairs?.length ? (
        pairs.map(([user, pair]) => {
          return (
            <ItemContainer key={`user-${user?.id}`}>
              <Badge
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                overlap="circular"
                badgeContent={
                  <Avatar src={pair?.image || ''} alt={pair?.name}>
                    {stringAvatar(pair?.name)}
                  </Avatar>
                }
              >
                <Avatar sx={{ height: 64, width: 64, bgcolor: theme.colors.info }} src={user?.image || ''} alt={user?.name}>
                  {stringAvatar(user?.name)}
                </Avatar>
              </Badge>
              <Typography align="center" variant="h6">
                {getName(user?.name)}
              </Typography>
              <Typography align="center" variant="caption">
                {getName(pair?.name)}
              </Typography>
            </ItemContainer>
          )
        })
      ) : (
        <Typography variant="h5" align="center" py={4} width="100%">
          Nenhuma dupla encontrado nessa categoria
        </Typography>
      )}
    </ListContainer>
  )
}

const ListContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: stretch;
  justify-content: stretch;
  padding: 4px;
`

const ItemContainer = styled.div`
  width: calc(100% / 3);
  display: flex;
  padding: 12px 0;
  flex-flow: column wrap;
  align-items: center;
  justify-content: center;

  h6,
  p {
    padding: 12px 0;
  }
`
