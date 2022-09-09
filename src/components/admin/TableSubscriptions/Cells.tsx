import React, { useState } from 'react'

import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import FemaleIcon from '@mui/icons-material/Female'
import MaleIcon from '@mui/icons-material/Male'
import MoneyOffIcon from '@mui/icons-material/MoneyOff'
import PaidOutlined from '@mui/icons-material/PaidOutlined'
import VerifiedIcon from '@mui/icons-material/Verified'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Icon from '@mui/material/Icon'
import IconButton from '@mui/material/IconButton'
import Switch from '@mui/material/Switch'
import Tooltip from '@mui/material/Tooltip'
import { format, isValid, parseJSON } from 'date-fns'

import { useAppTheme } from '~/components/AppThemeProvider/useAppTheme'
import { SimpleModal } from '~/components/Common/SimpleModal'
import { ICustomCellProps } from '~/components/CustomTable'
import { FormRegister } from '~/components/forms/UnForm/FormRegister'
import { FlexContainer, Text } from '~/components/styled'
import { CellContainer, CellTools } from '~/components/tables/cells/styles'
import { useTableActions } from '~/components/tables/TableActionsProvider'
import { genderColors } from '~/config/constants'
import { formatPrice } from '~/helpers'
import { alpha } from '~/helpers/colors'
import { splitDateTime } from '~/helpers/dates'
import { normalizeImageSrc, stringAvatar } from '~/helpers/string'
import type { ISubscription } from '~/server-side/useCases/subscriptions/subscriptions.dto'
import { updateSubscription } from '~/services/api/subscriptions'

// import { PaymentIcon } from '../PaymentIcon'
import type { ISubscriptionActions } from './Actions'

type Props = ICustomCellProps<ISubscription>

export const PaidCell: React.FC<Props> = ({ record }) => {
  // const { emitFetch } = useCustomTableFilter()
  const { setCustom } = useTableActions<ISubscriptionActions>()
  const handleClick = () => setCustom({ paymentId: record?.paymentId })
  // return (
  //   <CellContainer>
  //     <PaymentIcon value={record?.value} id={record.id} paid={!!record.paid} paymentId={record?.paymentId} updateSubscriptionHandler={emitFetch} />
  //   </CellContainer>
  // )
  return (
    <>
      <CellContainer>
        <FlexContainer>
          {record?.paid ? (
            <PaidOutlined fontSize={'small'} />
          ) : (
            <IconButton onClick={handleClick}>
              <Tooltip title={`Verificar pagamento ${record?.paymentId}`}>
                <MoneyOffIcon fontSize={'small'} />
              </Tooltip>
            </IconButton>
          )}
        </FlexContainer>
      </CellContainer>
    </>
  )
}

export const CheckCell: React.FC<Props> = ({ record }) => {
  const { setCustom, custom } = useTableActions<ISubscriptionActions>()

  const handleClick = (_e, checked?: boolean) => {
    setCustom(old => {
      const list = old?.selectList?.filter(f => f.subscriptionId !== record?.id) || []
      return {
        ...old,
        selectList: checked ? [...list, { subscriptionId: record.id, userId: record.userId }] : list
      }
    })
  }

  const active = (custom?.selectList || []).find(f => f.subscriptionId === record?.id)
  return (
    <>
      <Checkbox checked={!!active} onChange={handleClick} />
    </>
  )
}

export const PriceCell: React.FC<Props> = ({ record }) => {
  const price = record?.value || 0

  return (
    <CellContainer>
      <FlexContainer>
        <Text textSize={12}>{formatPrice(price)}</Text>
      </FlexContainer>
    </CellContainer>
  )
}

export const SwitchCell: React.FC<Props> = ({ record }) => {
  const [checked, setChecked] = useState(!!record?.verified)

  const save = async (published: boolean) => {
    await updateSubscription(record?.id, { verified: published ? new Date() : null })
  }

  const handleChange = (evt: any, chk?: boolean) => {
    setChecked(!!chk)
    save(!!chk)
  }

  return (
    <CellContainer>
      <Switch size="small" checked={checked} onChange={handleChange} color="success" />
    </CellContainer>
  )
}

export const NameCell: React.FC<Props> = ({ record }) => {
  const { user, partner } = record

  const [open, setOpen] = useState<string>(null)

  const { theme } = useAppTheme()
  const handleClose = () => {
    setOpen(null)
  }

  const GerderIco = {
    M: MaleIcon,
    F: FemaleIcon
  }

  const renderGenderIcon = (I: typeof Icon) => {
    if (!I) return null
    return (
      <Text textColor={alpha(theme.colors.text, 0.7)}>
        <I sx={{ width: 16, height: 16 }} fontSize="small" />
      </Text>
    )
  }
  return (
    <CellContainer>
      <FlexContainer justify="flex-start" gap={8}>
        <AvatarGroup>
          [
          <Avatar src={normalizeImageSrc(user?.image)} sx={{ bgcolor: genderColors[user?.gender] }}>
            {stringAvatar(user?.name)}
          </Avatar>
          ,
          <Avatar src={normalizeImageSrc(partner?.image)} sx={{ bgcolor: genderColors[partner?.gender] }}>
            {stringAvatar(partner?.name)}
          </Avatar>
          ]
        </AvatarGroup>
        <div>
          <FlexContainer justify="flex-start">
            <Button size="small" onClick={() => setOpen(user?.id)} color="inherit">
              <Text title={user?.nick || user?.name}>{user?.name}</Text>
            </Button>
            {renderGenderIcon(GerderIco[user?.gender] || null)}
            {user?.completed ? renderGenderIcon(VerifiedIcon) : null}
          </FlexContainer>
          <FlexContainer justify="flex-start">
            <Button size="small" onClick={() => setOpen(partner?.id)} color="inherit">
              <Text textSize={12} textColor={alpha('#ffffff', 0.7)}>
                {partner?.name}
              </Text>
            </Button>
            {renderGenderIcon(GerderIco[partner?.gender] || null)}
            {partner?.completed ? renderGenderIcon(VerifiedIcon) : null}
          </FlexContainer>
        </div>
      </FlexContainer>
      <SimpleModal open={!!open} onToggle={handleClose} title="Editar usuário">
        <FormRegister userId={open} onCancel={handleClose} />
      </SimpleModal>
    </CellContainer>
  )
}

export const DateTimeCell: React.FC<Props> = ({ record }) => {
  const [date = '--', time = '--'] = record?.createdAt ? splitDateTime(record?.createdAt ? `${record?.createdAt}` : null) : '--'
  return (
    <CellContainer>
      <Text textSize={14}>{date}</Text>
      <br />
      <Text textSize={12}>{time}</Text>
    </CellContainer>
  )
}

type DateCellProps = { date: string | Date }
export const DateCell: React.FC<DateCellProps> = ({ date }) => {
  const d = date instanceof Date ? date : parseJSON(date)

  const text = isValid(d) ? format(d, 'dd/MM/yyyy') : '--'
  return (
    <CellContainer>
      <Text textSize={14}>{text}</Text>
    </CellContainer>
  )
}

export const ActionCell: React.FC<Props> = ({ record }) => {
  const { setCustom } = useTableActions<ISubscriptionActions>()

  const handleEdit = () => {
    setCustom({ editId: record?.id })
  }

  const handleDel = () => {
    setCustom({ deleteId: record?.id })
  }
  return (
    <CellContainer>
      <CellTools>
        <IconButton onClick={handleEdit}>
          <Tooltip title="Alterar" arrow>
            <EditIcon />
          </Tooltip>
        </IconButton>

        <IconButton onClick={handleDel} disabled>
          <Tooltip title="Alterar" arrow>
            <DeleteIcon />
          </Tooltip>
        </IconButton>
      </CellTools>
    </CellContainer>
  )
}
