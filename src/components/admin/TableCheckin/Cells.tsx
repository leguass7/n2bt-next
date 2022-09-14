import React, { memo } from 'react'

import Avatar from '@mui/material/Avatar'
import Checkbox from '@mui/material/Checkbox'

import type { ICustomCellProps } from '~/components/CustomTable'
import { FlexContainer, Text } from '~/components/styled'
import { CellContainer } from '~/components/tables/cells/styles'
import { useTableActions } from '~/components/tables/TableActionsProvider'
import { genderColors } from '~/config/constants'
import { splitDateTime } from '~/helpers/dates'
import { normalizeImageSrc, stringAvatar } from '~/helpers/string'
import type { CheckinRawDto } from '~/server-side/useCases/checkin/checkin.dto'

import type { ICheckinActions } from './Actions'

type Props = ICustomCellProps<CheckinRawDto>

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

const Check: React.FC<Props> = ({ record }) => {
  const { setCustom, custom } = useTableActions<ICheckinActions>()
  const userId = record?.userId

  const handleClick = (_e, checked?: boolean) => {
    if (userId) {
      setCustom(old => {
        const list = old?.userSelectedList?.filter(f => f !== record?.userId) || []
        return { ...old, selectList: checked ? [...list, record.userId] : list }
      })
    }
  }

  const active = (custom?.userSelectedList || []).find(f => f === record?.userId)
  return (
    <>
      <Checkbox checked={!!active} onChange={handleClick} />
    </>
  )
}
export const CheckCell = memo(Check)

const Name: React.FC<Props> = ({ record }) => {
  const { image, name, nick, email, gender, title } = record

  return (
    <CellContainer>
      <FlexContainer justify="flex-start" gap={8}>
        <Avatar src={normalizeImageSrc(image)} sx={{ bgcolor: genderColors[gender] }}>
          {stringAvatar(name)}
        </Avatar>
        <div>
          <FlexContainer justify="flex-start">
            <Text title={nick || name}>{name}</Text>
          </FlexContainer>
          <FlexContainer justify="flex-start">
            <Text textSize={12} textStyle="italic">
              {email}
            </Text>
          </FlexContainer>
          <FlexContainer justify="flex-start">
            <Text>
              {title} {gender}
            </Text>
          </FlexContainer>
        </div>
      </FlexContainer>
    </CellContainer>
  )
}

export const NameCell = memo(Name)
