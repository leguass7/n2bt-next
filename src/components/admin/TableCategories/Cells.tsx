import React, { useState } from 'react'

import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'
import Switch from '@mui/material/Switch'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import { format, isValid, parseJSON } from 'date-fns'

import type { ICustomCellProps } from '~/components/CustomTable'
import { Text } from '~/components/styled'
import { CellContainer } from '~/components/tables/cells/styles'
import { useTableActions } from '~/components/tables/TableActionsProvider'
import { splitDateTime } from '~/helpers/dates'
import type { ICategory } from '~/server-side/useCases/category/category.dto'
import { updateCategory } from '~/services/api/category'

import type { ICategoryActions } from './Actions'

type Props = ICustomCellProps<ICategory>

export const SwitchCell: React.FC<Props> = ({ record }) => {
  const [checked, setChecked] = useState(!!record?.published)

  const save = async (published: boolean) => {
    await updateCategory(record?.id, { published })
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

export const ActionCell: React.FC<Props> = ({ record }) => {
  const { setCustom } = useTableActions<ICategoryActions>()

  const handleEdit = () => {
    setCustom({ editId: record?.id })
  }

  const handleDel = () => {
    setCustom({ deleteId: record?.id })
  }
  return (
    <CellContainer>
      <Toolbar>
        <Tooltip title="Alterar" arrow>
          <IconButton size="small" onClick={handleEdit}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Alterar" arrow>
          <IconButton size="small" onClick={handleDel}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </CellContainer>
  )
}
