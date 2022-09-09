import React, { useState } from 'react'

import DeleteIcon from '@mui/icons-material/DeleteForever'
import EditIcon from '@mui/icons-material/Edit'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import { SimpleModal } from '~/components/Common/SimpleModal'
import type { ICustomCellProps } from '~/components/CustomTable'
import { FormRegister } from '~/components/forms/UnForm/FormRegister'
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
  const [open, setOpen] = useState<string>(null)
  const { user } = record

  const handleClose = () => {
    setOpen(null)
  }

  return (
    <CellContainer>
      <FlexContainer justify="flex-start" gap={8}>
        <Avatar src={normalizeImageSrc(user?.image)} sx={{ bgcolor: genderColors[user?.gender] }}>
          {stringAvatar(user?.name)}
        </Avatar>
        <div>
          <FlexContainer justify="flex-start">
            <Button size="small" onClick={() => setOpen(user?.id)} color="inherit" variant="text">
              <Text title={user?.nick || user?.name}>{user?.name}</Text>
            </Button>
          </FlexContainer>
          <FlexContainer justify="flex-start">
            <Text textSize={12} textStyle="italic">
              {user?.email}
            </Text>
          </FlexContainer>
        </div>
      </FlexContainer>
      <SimpleModal open={!!open} onToggle={handleClose} title="Editar usuário">
        <FormRegister userId={open} onCancel={handleClose} />
      </SimpleModal>
    </CellContainer>
  )
}

export const ActionCell: React.FC<Props> = ({ record }) => {
  const { setCustom } = useTableActions<IRankingActions>()

  const handleEdit = () => {
    setCustom({ editId: record?.id })
  }

  const handleDel = () => setCustom({ deleteId: record?.id })
  return (
    <CellContainer>
      <CellTools>
        <IconButton onClick={handleEdit}>
          <Tooltip title="Alterar" arrow>
            <EditIcon />
          </Tooltip>
        </IconButton>

        <IconButton onClick={handleDel}>
          <Tooltip title="Remover" arrow>
            <DeleteIcon />
          </Tooltip>
        </IconButton>
      </CellTools>
    </CellContainer>
  )
}
