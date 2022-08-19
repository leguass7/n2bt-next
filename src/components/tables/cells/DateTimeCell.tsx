import { splitDateTime } from '~/helpers/dates'
import type { TextProps } from '~/styles/types'

import { CellContainer, P, Span } from './styles'

type DateTimeCellProps = { datetime?: string } & TextProps

export const DateTimeCell: React.FC<DateTimeCellProps> = ({ datetime, ...textProps }) => {
  const [date = '--', time] = splitDateTime(datetime)
  return (
    <CellContainer>
      <P {...textProps}>
        <Span textSize={14}>{date}</Span>
        {time ? (
          <>
            <br />
            <Span textSize={12}>{time}</Span>
          </>
        ) : null}
      </P>
    </CellContainer>
  )
}
