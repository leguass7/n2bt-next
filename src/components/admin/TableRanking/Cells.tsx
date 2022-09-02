import React from 'react'

import DeleteIcon from '@mui/icons-material/DeleteForever'
import EditIcon from '@mui/icons-material/Edit'
import Avatar from '@mui/material/Avatar'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import type { ICustomCellProps } from '~/components/CustomTable'
import { FlexContainer, Text } from '~/components/styled'
import { CellContainer, CellTools } from '~/components/tables/cells/styles'
import { useTableActions } from '~/components/tables/TableActionsProvider'
import { genderColors } from '~/config/constants'
import { splitDateTime } from '~/helpers/dates'
import { normalizeImageSrc, stringAvatar } from '~/helpers/string'
import type { IRanking } from '~/server-side/useCases/ranking/ranking.dto'

import type { IRankingActions } from './Actions'

type Props = ICustomCellProps<IRanking>

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

export const CheckCell: React.FC<Props> = ({ record }) => {
  const { setCustom, custom } = useTableActions<IRankingActions>()

  const handleClick = (_e, checked?: boolean) => {
    setCustom(old => {
      const list = old?.selectList?.filter(f => f !== record?.id) || []
      return { ...old, selectList: checked ? [...list, record.id] : list }
    })
  }

  const active = (custom?.selectList || []).find(f => f === record?.id)
  return (
    <>
      <Checkbox checked={!!active} onChange={handleClick} />
    </>
  )
}

export const NameCell: React.FC<Props> = ({ record }) => {
  const { user } = record

  return (
    <CellContainer>
      <FlexContainer justify="flex-start" gap={8}>
        <Avatar src={normalizeImageSrc(user?.image)} sx={{ bgcolor: genderColors[user?.gender] }}>
          {stringAvatar(user?.name)}
        </Avatar>
        <div>
          <FlexContainer justify="flex-start">
            <Text title={user?.name}>{user?.nick || user?.name}</Text>
          </FlexContainer>
        </div>
      </FlexContainer>
    </CellContainer>
  )
}

export const ActionCell: React.FC<Props> = ({ record }) => {
  const { setCustom } = useTableActions<IRankingActions>()

  const handleEdit = () => {
    setCustom({ editId: record?.id })
  }

  const handleDel = () => {
    setCustom({ deleteId: record?.id })
  }
  return (
    <CellContainer>
      <CellTools>
        <IconButton onClick={handleEdit} disabled>
          <Tooltip title="Alterar" arrow>
            <EditIcon />
          </Tooltip>
        </IconButton>

        <IconButton onClick={handleDel} disabled>
          <Tooltip title="Remover" arrow>
            <DeleteIcon />
          </Tooltip>
        </IconButton>
      </CellTools>
    </CellContainer>
  )
}
