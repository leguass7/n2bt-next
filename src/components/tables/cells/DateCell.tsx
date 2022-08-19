import React from 'react'

import { formatMysqlDate } from '~/helpers/dates'
import type { TextProps } from '~/styles/types'

import { CellContainer, P, Span } from './styles'

type DateCellProps = { date?: string } & TextProps
export const DateCell: React.FC<DateCellProps> = ({ date, ...textProps }) => {
  return (
    <CellContainer>
      <P {...textProps}>
        <Span textSize={14}>{date ? formatMysqlDate(date) : null}</Span>
      </P>
    </CellContainer>
  )
}
