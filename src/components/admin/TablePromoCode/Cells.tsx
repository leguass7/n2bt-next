import React, { memo, useState } from 'react'

import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import EditIcon from '@mui/icons-material/Edit'
import LinkIcon from '@mui/icons-material/Link'
import { IconButton, Switch, Toolbar, Tooltip } from '@mui/material'

import type { ICustomCellProps } from '~/components/CustomTable'
import { Text } from '~/components/styled'
import { CellContainer } from '~/components/tables/cells/styles'
import { useTableActions } from '~/components/tables/TableActionsProvider'
import { appBaseURL } from '~/config'
import { splitDateTime } from '~/helpers/dates'
import type { IPromoCode } from '~/server-side/useCases/promo-code/promo-code.dto'
import { updatePromoCode } from '~/services/api/promo-code'

import { IPromoCodeActions } from './Actions'

type Props = ICustomCellProps<IPromoCode>

const DateTime: React.FC<Props> = ({ record }) => {
  const [date = '--', time = '--'] = record?.createdAt ? splitDateTime(record?.createdAt ? `${record.createdAt}` : null) : '--'

  return (
    <CellContainer>
      <Text textSize={14} align="right">
        {date}
      </Text>
      <Text textSize={12} align="right">
        {time}
      </Text>
    </CellContainer>
  )
}
export const DateTimeCell = memo(DateTime)

export const OptionTools: React.FC<Props> = ({ record }) => {
  const [tipOpen, setTipOpen] = useState(false)
  const { custom, setCustom } = useTableActions<IPromoCodeActions>()

  const strLink = `${appBaseURL}/subscription?tournamentId=${record.tournamentId}&promo=${record.code}`

  const handleClickDelete = () => setCustom({ deleteId: record?.id })
  const handleClickEdit = () => setCustom({ editId: record?.id })
  const handleClickCopy = () => {
    if (strLink) navigator?.clipboard?.writeText(strLink)
    setTipOpen(true)
  }
  const disabled = !!custom?.editId

  return (
    <CellContainer>
      <Toolbar sx={{ gap: 1 }}>
        <IconButton onClick={handleClickEdit} disabled={disabled}>
          <Tooltip title="Alterar" arrow>
            <EditIcon />
          </Tooltip>
        </IconButton>
        <IconButton onClick={handleClickCopy} disabled={disabled}>
          <Tooltip open={!!tipOpen} title="Link copiado" arrow onMouseLeave={() => setTipOpen(false)}>
            <LinkIcon />
          </Tooltip>
        </IconButton>
        <IconButton onClick={handleClickDelete} disabled={disabled}>
          <Tooltip title="Remover código" arrow>
            <DeleteForeverIcon />
          </Tooltip>
        </IconButton>
      </Toolbar>
    </CellContainer>
  )
}

export const LimitCell: React.FC<Props> = ({ record }) => {
  const used = record?.payments?.length || 0
  const discount = record?.discount || 0
  return (
    <CellContainer>
      <Text textSize={14}>{`${used} de ${record?.usageLimit}`}</Text>
      {discount ? <Text textSize={10}>desconto: {discount * 100}%</Text> : null}
    </CellContainer>
  )
}

export const SwitchCell: React.FC<Props> = ({ record }) => {
  const [checked, setChecked] = useState(!!record?.actived)

  const save = async (actived: boolean) => {
    await updatePromoCode(record?.id, { actived })
  }

  const handleChange = (evt: any, chk?: boolean) => {
    setChecked(!!chk)
    save(!!chk)
  }

  return (
    <CellContainer>
      <Switch size="small" checked={checked} onChange={handleChange} />
    </CellContainer>
  )
}
