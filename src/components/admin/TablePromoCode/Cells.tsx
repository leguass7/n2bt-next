import React, { memo } from 'react'

import EditIcon from '@mui/icons-material/Edit'
import { IconButton, Toolbar, Tooltip } from '@mui/material'

import type { ICustomCellProps } from '~/components/CustomTable'
import { Text } from '~/components/styled'
import { CellContainer } from '~/components/tables/cells/styles'
import { useTableActions } from '~/components/tables/TableActionsProvider'
import { splitDateTime } from '~/helpers/dates'
import type { IPromoCode } from '~/server-side/useCases/promo-code/promo-code.dto'

import { IPromoCodeActions } from './Actions'

type Props = ICustomCellProps<IPromoCode>

const DateTime: React.FC<Props> = ({ record }) => {
  const [date = '--', time = '--'] = record?.createdAt ? splitDateTime(record?.createdAt ? `${record.createdAt}` : null) : '--'

  return (
    <CellContainer>
      <Text textSize={14}>{date}</Text>
      <br />
      <Text textSize={12}>{time}</Text>
    </CellContainer>
  )
}
export const DateTimeCell = memo(DateTime)

export const OptionTools: React.FC<Props> = ({ record }) => {
  const { custom, setCustom } = useTableActions<IPromoCodeActions>()

  const handleEdit = () => setCustom({ editId: record?.id })
  const disabled = !!custom?.editId

  return (
    <CellContainer>
      <Toolbar>
        <IconButton onClick={handleEdit} disabled={disabled}>
          <Tooltip title="Alterar" arrow>
            <EditIcon />
          </Tooltip>
        </IconButton>
      </Toolbar>
    </CellContainer>
  )
}
