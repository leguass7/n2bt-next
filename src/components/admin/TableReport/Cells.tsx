import { useCallback, useState } from 'react'

import { DoneRounded, WarningRounded } from '@mui/icons-material'
import { Box, Checkbox, Typography } from '@mui/material'

import type { ICustomCellProps } from '~/components/CustomTable'
import { formatPrice } from '~/helpers'
import { useIsMounted } from '~/hooks/useIsMounted'
import type { ISubscriptionReport } from '~/server-side/useCases/subscriptions/subscriptions.dto'
import { updateSubscription } from '~/services/api/subscriptions'

type Props = ICustomCellProps<ISubscriptionReport>

export const ReportNameCell: React.FC<Props> = ({ record }) => {
  const { name, email, phone, nick } = record.user
  return (
    <div>
      <Typography variant="body1">
        {name} {nick ? `(${nick})` : null}
      </Typography>
      <Typography display="block" variant="body2">
        {email}
      </Typography>
      <Typography variant="caption">{phone}</Typography>
    </div>
  )
}

export const ReportPriceCell: React.FC<Props> = ({ record }) => {
  const { value } = record
  return (
    <div>
      <Typography variant="body1">{formatPrice(value)}</Typography>
    </div>
  )
}

export const ReportPromoCodeCell: React.FC<Props> = ({ record }) => {
  const code = record?.payment?.find?.(p => !!p.promoCode)?.promoCode?.code

  return (
    <div>
      <Typography variant="body1">{code || '--'}</Typography>
    </div>
  )
}

export const ReportGenderCell: React.FC<Props> = ({ record }) => {
  const { gender } = record.user

  return (
    <div>
      <Typography variant="body1">{gender}</Typography>
    </div>
  )
}

export const ReportShirtSizeCell: React.FC<Props> = ({ record }) => {
  const { shirtSize } = record.user

  return (
    <div>
      <Typography variant="body1">{shirtSize}</Typography>
    </div>
  )
}

export const ReportPaymentCell: React.FC<Props> = ({ record }) => {
  const { paid } = record

  return (
    <div>
      {paid ? (
        <Box dir="column">
          <DoneRounded />
          <Typography variant="body2">Pago</Typography>
        </Box>
      ) : (
        <Box>
          <Box dir="column" flexWrap="wrap" justifyContent="center" alignItems="center" color={'error'}>
            <div>
              <WarningRounded color="disabled" />
            </div>
            <Typography variant="body2" color="error">
              Não pago
            </Typography>
          </Box>
        </Box>
      )}
    </div>
  )
}

export const ReportStatusCell: React.FC<Props> = ({ record }) => {
  const { id, shirtDelivered } = record
  const [checked, setChecked] = useState(!!shirtDelivered)

  const [loading, setLoading] = useState(false)
  const isMounted = useIsMounted()

  const handleChange = useCallback(
    async (e, check) => {
      if (!id) return

      setLoading(true)
      setChecked(check)

      const shirtDelivered = check ? new Date() : null
      await updateSubscription(id, { shirtDelivered })

      if (isMounted()) setLoading(false)
    },
    [id, isMounted]
  )

  return (
    <div>
      <Checkbox disabled={loading} onChange={handleChange} checked={checked} />
    </div>
  )
}
