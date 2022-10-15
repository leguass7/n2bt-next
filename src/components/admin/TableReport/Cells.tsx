import { useCallback, useState } from 'react'

import { DoneRounded, WarningRounded } from '@mui/icons-material'
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'

import { ICustomCellProps } from '~/components/CustomTable'
import { ISubscription } from '~/server-side/useCases/subscriptions/subscriptions.dto'
import { ShirtStatus } from '~/server-side/useCases/subscriptions/subscriptions.entity'
import { updateSubscription } from '~/services/api/subscriptions'

type Props = ICustomCellProps<ISubscription>

export const ReportNameCell: React.FC<Props> = ({ record }) => {
  const { name, email } = record.user
  return (
    <div>
      <Typography align="left" variant="h6">
        {name}
      </Typography>
      <Typography align="left" variant="caption">
        {email}
      </Typography>
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
          <div>Pago</div>
        </Box>
      ) : (
        <Box>
          <Box dir="column" flexWrap="wrap" justifyContent="center" alignItems="center">
            <div>
              <WarningRounded />
            </div>
            <div>Não pago</div>
          </Box>
        </Box>
      )}
    </div>
  )
}

export const ReportStatusCell: React.FC<Props> = ({ record }) => {
  const { shirtStatus, id } = record
  const [selected, setSelected] = useState(shirtStatus)

  const handleChange = useCallback(
    async e => {
      if (!id) return

      const value = e.target.value
      setSelected(value)

      await updateSubscription(id, { shirtStatus: value })
    },
    [id]
  )

  // console.log(selected)

  return (
    <div>
      {selected === ShirtStatus.WAITING ? (
        <Button color="inherit" variant="outlined" onClick={() => setSelected(ShirtStatus.PRODUCTION)}>
          Produzir blusa
        </Button>
      ) : (
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select label="Status" value={selected} onChange={handleChange}>
            <MenuItem value={ShirtStatus.WAITING}>{ShirtStatus.WAITING}</MenuItem>
            <MenuItem value={ShirtStatus.PRODUCTION}>{ShirtStatus.PRODUCTION}</MenuItem>
            <MenuItem value={ShirtStatus.SENT}>{ShirtStatus.SENT}</MenuItem>
            <MenuItem value={ShirtStatus.DELIVERED}>{ShirtStatus.DELIVERED}</MenuItem>
          </Select>
        </FormControl>
      )}
    </div>
  )
}
