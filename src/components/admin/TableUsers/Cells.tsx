import React, { useState } from 'react'

// import ContentCopyIcon from '@mui/icons-material/ContentCopy'
// import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Link from 'next/link'

import { useAppTheme } from '~/components/AppThemeProvider/useAppTheme'
import { SimpleModal } from '~/components/Common/SimpleModal'
import { ICustomCellProps, useCustomTableFilter } from '~/components/CustomTable'
import { FormRegister } from '~/components/forms/UnForm/FormRegister'
import { Text } from '~/components/styled'
import { CellContainer, CellTools } from '~/components/tables/cells/styles'
import { useTableActions } from '~/components/tables/TableActionsProvider'
import { formatMysqlDate } from '~/helpers/dates'
import type { IUser } from '~/server-side/useCases/user/user.dto'

// import type { ICustomAction } from './Filter'
export interface ICustomAction {
  deleteId?: string | string
  copyId?: string
  editId?: string
}

type Props = ICustomCellProps<IUser>
type NameCellProps = { id: string; name: string; description: string }

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
  const str = record?.birday ? formatMysqlDate(record?.birday ? `${record?.birday}` : null) : '--'
  return (
    <CellContainer>
      <Text textSize={14}>{str}</Text>
    </CellContainer>
  )
}

export const ActionCell: React.FC<Props> = ({ record }) => {
  const { setCustom } = useTableActions<ICustomAction>()
  const { emitFetch } = useCustomTableFilter()
  const [open, setOpen] = useState(false)
  const { id } = record

  // const handleDelete = () => {
  //   setCustom({ deleteId: record?.id })
  // }

  const editArchitecture = () => {
    setCustom({ editId: id })
  }

  const toggle = () => {
    editArchitecture()
    setOpen(old => !old)
    emitFetch()
  }

  // const copyArchitecture = () => {
  //   setCustom({ copyId: record?.id })
  // }

  return (
    <CellContainer>
      <CellTools>
        {/* <Tooltip title={'remover'} arrow>
          <IconButton size="small" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={'copiar'} arrow>
          <IconButton size="small" onClick={copyArchitecture}>
            <ContentCopyIcon />
          </IconButton>
        </Tooltip> */}
        <Tooltip title={'editar'} arrow>
          <IconButton size="medium" onClick={toggle}>
            <EditIcon />
          </IconButton>
        </Tooltip>
      </CellTools>
      <SimpleModal open={open} onToggle={toggle} title="Editar usuário">
        <FormRegister userId={id} />
      </SimpleModal>
    </CellContainer>
  )
}
