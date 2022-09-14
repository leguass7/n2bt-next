import React, { useState } from 'react'

import CheckIcon from '@mui/icons-material/Check'
import EditIcon from '@mui/icons-material/Edit'
import FemaleIcon from '@mui/icons-material/Female'
import MaleIcon from '@mui/icons-material/Male'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { differenceInYears } from 'date-fns'

import { SimpleModal } from '~/components/Common/SimpleModal'
import { ICustomCellProps, useCustomTableFilter } from '~/components/CustomTable'
import { FormRegister } from '~/components/forms/UnForm/FormRegister'
import { Text } from '~/components/styled'
import { FlexContainer } from '~/components/styled'
import { CellContainer, CellTools } from '~/components/tables/cells/styles'
import { useTableActions } from '~/components/tables/TableActionsProvider'
import { formatMysqlDate, splitDateTime, tryDate } from '~/helpers/dates'
import type { IUser } from '~/server-side/useCases/user/user.dto'

import type { IUserActions } from './Actions'

export type UserCellProps = ICustomCellProps<IUser & { totalSubscriptions?: number; totalPayments?: number }>
type Props = UserCellProps

export const NameCell: React.FC<Props> = ({ record }) => {
  const genderIcon = {
    M: <MaleIcon fontSize="small" sx={{ width: 16, height: 16 }} />,
    F: <FemaleIcon fontSize="small" sx={{ width: 16, height: 16 }} />
  }

  return (
    <CellContainer>
      {/* <Link href={href}>{name}</Link> */}
      <FlexContainer>
        <Text bold>
          {record?.name} <Text>{genderIcon?.[record?.gender]}</Text>
        </Text>
      </FlexContainer>
      <FlexContainer>
        <Text textSize={12} textStyle="italic">
          {record?.email}{' '}
          {record?.emailVerified ? (
            <Text>
              <CheckIcon fontSize="small" sx={{ width: 14, height: 14 }} color="success" />
            </Text>
          ) : null}
        </Text>
      </FlexContainer>
    </CellContainer>
  )
}

export const LastAcessCell: React.FC<Props> = ({ record }) => {
  const [d, h] = record?.lastAcess ? splitDateTime(`${record?.lastAcess}`) || ['--', '--'] : ['-', '-']
  return (
    <CellContainer>
      <Text align="center">
        {d}
        <br />
        <Text textStyle="italic" align="center">
          {h}
        </Text>
      </Text>
    </CellContainer>
  )
}

export const CountCell: React.FC<Props> = ({ record }) => {
  return (
    <CellContainer>
      <Text>
        <Text bold textSize={12}>
          {record?.totalSubscriptions ?? '--'}
        </Text>{' '}
        inscrições
      </Text>
      <Text>
        <Text bold textSize={12}>
          {record?.totalPayments ?? '--'}
        </Text>{' '}
        pagamentos
      </Text>
    </CellContainer>
  )
}

export const PhoneCell: React.FC<Props> = ({ record }) => {
  return (
    <CellContainer>
      <Text>{record?.phone || '--'}</Text>
      <Text textStyle="italic" textSize={12}>
        {record?.cpf || '--'}
      </Text>
    </CellContainer>
  )
}

export const DateCell: React.FC<Props> = ({ record }) => {
  const str = record?.birday ? formatMysqlDate(record?.birday ? `${record?.birday}` : null) : '--'
  const getAge = () => {
    const d = tryDate(`${record?.birday}`)
    return d ? differenceInYears(new Date(), d) : null
  }
  const age = str ? getAge() : null
  return (
    <CellContainer>
      <Text textSize={14}>{str}</Text>
      {age ? (
        <Text textSize={14}>
          <Text textSize={14} bold>
            {age}
          </Text>{' '}
          anos
        </Text>
      ) : null}
    </CellContainer>
  )
}

export const ActionCell: React.FC<Props> = ({ record }) => {
  const { setCustom } = useTableActions<IUserActions>()
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
