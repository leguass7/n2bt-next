import React, { memo, useState } from 'react'
import { toast } from 'react-toastify'

import Avatar from '@mui/material/Avatar'
import Switch from '@mui/material/Switch'

import type { ICustomCellProps } from '~/components/CustomTable'
import { FlexContainer, Text } from '~/components/styled'
import { CellContainer } from '~/components/tables/cells/styles'
import { useTableActions } from '~/components/tables/TableActionsProvider'
import { genderColors } from '~/config/constants'
import { splitDateTime } from '~/helpers/dates'
import { normalizeImageSrc, stringAvatar } from '~/helpers/string'
import type { CheckinRawDto } from '~/server-side/useCases/checkin/checkin.dto'
import { storeCheckin } from '~/services/api/checkin'

import type { ICheckinActions } from './Actions'

type Props = ICustomCellProps<CheckinRawDto>

const DateTime: React.FC<Props> = ({ record }) => {
  const { custom } = useTableActions<ICheckinActions>()
  const [date = '--', time = '--'] = record?.createdAt ? splitDateTime(record?.createdAt ? `${record.createdAt}` : null) : '--'

  const checkin = !!custom?.userSelectedList?.find(f => f.includes(record?.userId))
  return (
    <CellContainer>
      {checkin ? (
        <>
          <Text textSize={14}>{date}</Text>
          <br />
          <Text textSize={12}>{time}</Text>
        </>
      ) : (
        <Text>--</Text>
      )}
    </CellContainer>
  )
}
export const DateTimeCell = memo(DateTime)

// const Check: React.FC<Props> = ({ record }) => {
//   const { setCustom, custom } = useTableActions<ICheckinActions>()
//   const userId = record?.userId

//   const handleClick = (_e, checked?: boolean) => {
//     if (userId) {
//       setCustom(old => {
//         const list = old?.userSelectedList?.filter(f => f !== record?.userId) || []
//         return { ...old, selectList: checked ? [...list, record.userId] : list }
//       })
//     }
//   }

//   const active = (custom?.userSelectedList || []).find(f => f === record?.userId)
//   return (
//     <>
//       <Checkbox checked={!!active} onChange={handleClick} />
//     </>
//   )
// }
// export const CheckCell = memo(Check)

const Name: React.FC<Props> = ({ record }) => {
  const { image, name, nick, email, gender } = record

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
        </div>
      </FlexContainer>
    </CellContainer>
  )
}

export const NameCell = memo(Name)

const SwitchCheck: React.FC<Props> = ({ record }) => {
  const [checked, setChecked] = useState(!!record?.check)
  const { setCustom } = useTableActions<ICheckinActions>()
  const userId = record?.userId
  const tournamentId = record?.tournamentId

  const handleClick = (_e: React.ChangeEvent<HTMLInputElement>, chk?: boolean) => {
    setChecked(!!chk)
    if (userId) {
      setCustom(old => {
        const list = old?.userSelectedList?.filter(f => f !== userId) || []
        return { ...old, userSelectedList: chk ? [...list, userId] : list }
      })
      storeCheckin({ check: !!chk, tournamentId, userId }).then(res => {
        if (!res?.success) toast.error(res?.message || 'Erro ao atualizar checkin')
        else if (!!chk) toast.success(`Checkin de ${record?.name} realizado`)
      })
    }
  }

  return <Switch checked={checked} onChange={handleClick} />
}

export const SwitchCell = memo(SwitchCheck)
