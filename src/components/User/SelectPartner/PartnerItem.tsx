import Checkbox from '@mui/material/Checkbox'
import styled from 'styled-components'

import { H4 } from '~/components/styled'
import type { IUser } from '~/server-side/useCases/user/user.dto'

type Props = IUser & {}

export const PartnerItem: React.FC<Props> = ({ name, email, phone, gender }) => {
  return (
    <ItemContainer>
      <CheckContainer>
        <Checkbox />
      </CheckContainer>
      <ItemContent>
        <H4>{name}</H4>
        <span>{email}</span>
      </ItemContent>
      <ItemContent>
        <H4>Sexo: {gender || ''}</H4>
        <span>{phone}</span>
      </ItemContent>
    </ItemContainer>
  )
}

const ItemContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  width: 100%;
`

const CheckContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const ItemContent = styled.div`
  flex: 1;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: flex-start;
  padding: 12px;
`
