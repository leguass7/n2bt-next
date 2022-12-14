import React, { useState } from 'react'

import Switch from '@mui/material/Switch'
import { format, isValid, parseJSON } from 'date-fns'

import type { ICustomCellProps } from '~/components/CustomTable'
import { Text } from '~/components/styled'
import { CellContainer } from '~/components/tables/cells/styles'
import { splitDateTime } from '~/helpers/dates'
import type { ITournament } from '~/server-side/useCases/tournament/tournament.dto'
import { updateTournament } from '~/services/api/tournament'

type Props = ICustomCellProps<ITournament>

export const SwitchCell: React.FC<Props> = ({ record }) => {
  const [checked, setChecked] = useState(!!record?.published)

  const save = async (published: boolean) => {
    await updateTournament(record?.id, { published })
  }

  const handleChange = (evt: any, chk?: boolean) => {
    setChecked(!!chk)
    save(!!chk)
  }

  return (
    <CellContainer>
      <Switch checked={checked} onChange={handleChange} />
    </CellContainer>
  )
}

export const NameCell: React.FC<Props> = ({ record }) => {
  return (
    <CellContainer>
      <Text>{record?.title}</Text>
    </CellContainer>
  )
}

export const DateTimeCell: React.FC<Props> = ({ record }) => {
  const [date = '--', time = '--'] = record?.createdAt ? splitDateTime(record?.createdAt ? `${record?.createdAt}` : null) : '--'
  return (
    <CellContainer>
      <Text textSize={14}>{date}</Text>
      <br />
      <Text textSize={12}>{time}</Text>
    </CellContainer>
  )
}

type DateCellProps = { date: string | Date }
export const DateCell: React.FC<DateCellProps> = ({ date }) => {
  const d = date instanceof Date ? date : parseJSON(date)

  const text = isValid(d) ? format(d, 'dd/MM/yyyy') : '--'
  return (
    <CellContainer>
      <Text textSize={14}>{text}</Text>
    </CellContainer>
  )
}
