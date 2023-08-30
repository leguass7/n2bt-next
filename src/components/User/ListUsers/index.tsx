import { useCallback, useEffect, useState } from 'react'

import { Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import styled from 'styled-components'

import { CircleLoading } from '~/components/CircleLoading'
import { useIsMounted } from '~/hooks/useIsMounted'
import { type IUser } from '~/server-side/useCases/user/user.dto'
import { listCategorySubscriptions } from '~/services/api/subscriptions'

interface Props {
  categoryId?: number
  children?: React.ReactNode
}

export const ListUsers: React.FC<Props> = ({ categoryId }) => {
  const [users, setUsers] = useState<IUser[]>([])
  const isMounted = useIsMounted()
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async () => {
    if (!categoryId) return null
    setLoading(true)
    const { success, subscriptions } = await listCategorySubscriptions(categoryId)
    if (isMounted()) {
      setLoading(false)
      if (success && subscriptions?.length) {
        const allUsers = subscriptions.map(({ user }) => user)
        setUsers(allUsers)
      }
    }
  }, [isMounted, categoryId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <Container>
      <List>
        {users?.map?.(({ id, name, image }) => {
          return (
            <ListItem key={`subscription-${id}`}>
              <ListItemAvatar>
                <Avatar src={image}>{name}</Avatar>
              </ListItemAvatar>
              <ListItemText>{name}</ListItemText>
            </ListItem>
          )
        })}
      </List>
      {loading ? <CircleLoading /> : null}
    </Container>
  )
}

const Container = styled.div`
  padding: 4px;
`
