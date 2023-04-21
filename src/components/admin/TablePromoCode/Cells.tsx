import React, { memo } from 'react'

import type { ICustomCellProps } from '~/components/CustomTable'
import { Text } from '~/components/styled'
import { CellContainer } from '~/components/tables/cells/styles'
import { splitDateTime } from '~/helpers/dates'
import type { IPromoCode } from '~/server-side/useCases/promo-code/promo-code.dto'

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
