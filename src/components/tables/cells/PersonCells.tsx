import { parseJSON, format } from 'date-fns'
// import ptBr from 'date-fns/locale/pt-BR'

import type { ICustomCellProps } from '~/components/CustomTable'
import { splitDateTime } from '~/helpers/formatDate'
import type { IPerson } from '~/services/ServerApi/person'

import { CellContainer, P, Span } from './styles'

export type PersonCellProps = ICustomCellProps<IPerson> & {}

export const DateCell: React.FC<PersonCellProps> = ({ record }) => {
  const createdAt = record?.createdAt && parseJSON(record.createdAt)
  // const relative = createdAt ? formatRelative(createdAt, new Date(), { locale: ptBr, weekStartsOn: 1 }) : '--'
  const [date, time] = createdAt ? format(createdAt, 'dd/MM/yyyy HH:mm').split(' ') : ['--', '']
  return (
    <CellContainer>
      <P align="center">
        <Span textSize={14}>{date}</Span>
        {time ? (
          <>
            <br />
            <Span>{time}</Span>
          </>
        ) : null}
      </P>
    </CellContainer>
  )
}

export const ContactCell: React.FC<PersonCellProps> = ({ record }) => {
  return (
    <CellContainer>
      <P>
        {record?.email}
        <br />
        <Span>{record?.mobile || record?.phone || '--'}</Span>
      </P>
    </CellContainer>
  )
}

type Props = { datetime: string | Date }
export const DateTimeContentCell: React.FC<Props> = ({ datetime }) => {
  const [date = '--', time] = splitDateTime(datetime)
  return (
    <CellContainer>
      <P align="center">
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
