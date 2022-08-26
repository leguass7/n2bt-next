import { useCallback, useState } from 'react'

import Button from '@mui/material/Button'
import List from '@mui/material/List'

import { SearchFetchHandler, SearchUserDrawer, SelectHandler } from '~/components/SearchUserDrawer'
import type { IUser } from '~/server-side/useCases/user/user.dto'
import { findUser } from '~/services/api/user'

import { BoxCenter, FlexContainer } from '../../styled'
import { Partner } from './Partner'

export type SelectPatnerHandler = (partner?: IUser) => any
export type DeletePatnerHandler = (id?: IUser['id']) => any
interface Props {
  tournamentId: number
  categoryId: number
  userId?: number
  onChange?: SelectPatnerHandler
  defaultPartner?: IUser | null
  onDelete?: DeletePatnerHandler
}

export const SelectPatner: React.FC<Props> = ({ tournamentId, categoryId, onChange, defaultPartner, onDelete }) => {
  const [partner, setPartner] = useState(defaultPartner)
  const [searching, setSearching] = useState(false)

  const search: SearchFetchHandler = useCallback(async filter => {
    const response = await findUser(filter)
    return response
  }, [])

  const handleSelect: SelectHandler = useCallback(
    async (userId, user) => {
      setPartner(user)
      if (userId && onChange) onChange(user)
    },
    [onChange]
  )

  const handleToogle = () => {
    setSearching(old => !old)
  }

  const handleDelete = (id: IUser['id']) => {
    setPartner(null)
    if (onDelete) onDelete(id)
  }

  return (
    <>
      <BoxCenter>
        {partner ? (
          <div style={{ minWidth: 260, width: '100%' }}>
            <List>
              <Partner {...partner} onDelete={handleDelete} />
            </List>
          </div>
        ) : (
          <FlexContainer verticalPad={20} justify="center">
            <Button variant="contained" color="primary" onClick={handleToogle}>
              Localizar sua dupla
            </Button>
          </FlexContainer>
        )}
      </BoxCenter>
      <SearchUserDrawer
        open={searching}
        fetcher={search}
        onClose={handleToogle}
        categoryId={categoryId}
        tournamentId={tournamentId}
        fixedFilter={{ tournamentId, categoryId }}
        userList={[]}
        onSelect={handleSelect}
      />
    </>
  )
}
