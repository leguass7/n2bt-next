import React from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'

import List from '@mui/material/List'

import type { IUser } from '~/server-side/useCases/user/user.dto'

import { Item } from './Item'
import { MessageContainer } from './styles'

type Props = {
  userList?: IUser['id'][]
  tournamentId?: number
  categoryId?: number
  list?: IUser[]
  onClickItem?: (personId: number | string) => void
  searchStarted?: boolean
  registeredGroups?: number[]
  message?: string
  notFoundMessage?: string
}

export const FoundList: React.FC<Props> = ({
  userList = [],
  tournamentId,
  categoryId,
  list = [],
  onClickItem,
  searchStarted,
  message = 'Buscar atletas cadastrados',
  notFoundMessage = 'Atleta não encontrado'
}) => {
  return (
    <>
      {list?.length ? (
        <List sx={{ height: 360 }}>
          <PerfectScrollbar>
            {list.map(person => {
              return (
                <Item
                  key={`found-item-${person?.id}`}
                  {...person}
                  hasIn={!!userList.includes(person?.id)}
                  onClickItem={onClickItem}
                  categoryId={categoryId}
                  tournamentId={tournamentId}
                />
              )
            })}
          </PerfectScrollbar>
        </List>
      ) : (
        <MessageContainer>
          <p>{searchStarted ? notFoundMessage : message}</p>
        </MessageContainer>
      )}
    </>
  )
}
