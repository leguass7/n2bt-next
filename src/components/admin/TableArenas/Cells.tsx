import React, { useState } from 'react'

import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { Typography } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Switch from '@mui/material/Switch'
import Tooltip from '@mui/material/Tooltip'

import type { ICustomCellProps } from '~/components/CustomTable'
import { Text } from '~/components/styled'
import { CellContainer, CellTools } from '~/components/tables/cells/styles'
import { useTableActions } from '~/components/tables/TableActionsProvider'
import { splitDateTime } from '~/helpers/dates'
import type { IArena } from '~/server-side/useCases/arena/arena.dto'
import { updateArena } from '~/services/api/arena'

import type { IArenaActions } from './Actions'

type Props = ICustomCellProps<IArena>

export const ArenaNameCell: React.FC<Props> = ({ record }) => {
  const { title = '', description = '' } = record

  return (
    <CellContainer>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="caption">{description}</Typography>
    </CellContainer>
  )
}

export const SwitchCell: React.FC<Props> = ({ record }) => {
  const [checked, setChecked] = useState(!!record?.published)

  const save = async (published: boolean) => {
    await updateArena(record?.id, { published })
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

export const DateCell: React.FC<Props> = ({ record }) => {
  const [date = '--', time = '--'] = record?.createdAt ? splitDateTime(record?.createdAt ? `${record?.createdAt}` : null) : '--'
  return (
    <CellContainer>
      <Text textSize={14}>{date}</Text>
      <Text textSize={12}>{time}</Text>
    </CellContainer>
  )
}

export const ActionCell: React.FC<Props> = ({ record }) => {
  const { setCustom } = useTableActions<IArenaActions>()

  const handleDelete = () => setCustom({ deleteId: record?.id })
  const handleEdit = () => setCustom({ editId: record?.id })

  return (
    <CellContainer>
      <CellTools>
        <Tooltip title={'Remover'} arrow>
          <IconButton size="small" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={'editar'} arrow>
          <IconButton size="medium" onClick={handleEdit}>
            <EditIcon />
          </IconButton>
        </Tooltip>
      </CellTools>
    </CellContainer>
  )
}
