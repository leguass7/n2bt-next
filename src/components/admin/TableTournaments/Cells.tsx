import React, { useState } from 'react'

import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'
import Switch from '@mui/material/Switch'
import Tooltip from '@mui/material/Tooltip'
import Link from 'next/link'

import { useAppTheme } from '~/components/AppThemeProvider/useAppTheme'
import type { ICustomCellProps } from '~/components/CustomTable'
import { Text } from '~/components/styled'
import { CellContainer, CellTools } from '~/components/tables/cells/styles'
import { useTableActions } from '~/components/tables/TableActionsProvider'
import { splitDateTime } from '~/helpers/dates'
import type { ITournament } from '~/server-side/useCases/tournament/tournament.dto'
import { updateTournament } from '~/services/api/tournament'

import type { IArenaActions } from './Actions'

type Props = ICustomCellProps<ITournament>
type NameCellProps = { id: string; name: string; description: string }

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

export const NameCell: React.FC<NameCellProps> = ({ id, description, name }) => {
  const { theme } = useAppTheme()
  const href = `/company/architecture/${id}`

  return (
    <CellContainer>
      <Link href={href}>{name}</Link>
      <Text textSize={12} textColor={!description ? theme.colors.border : null}>
        {!!description ? description : <i>Sem descrição</i>}
      </Text>
    </CellContainer>
  )
}

export const DateCell: React.FC<Props> = ({ record }) => {
  const [date = '--', time = '--'] = record?.createdAt ? splitDateTime(record?.createdAt ? `${record?.createdAt}` : null) : '--'
  return (
    <CellContainer>
      <Text textSize={14}>{date}</Text>
      <br />
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
        {/* <Tooltip title={'Remover'} arrow> */}
        <IconButton size="small" onClick={handleDelete} disabled>
          <DeleteIcon />
        </IconButton>
        {/* </Tooltip> */}
        <Tooltip title={'editar'} arrow>
          <IconButton size="medium" onClick={handleEdit}>
            <EditIcon />
          </IconButton>
        </Tooltip>
      </CellTools>
    </CellContainer>
  )
}
