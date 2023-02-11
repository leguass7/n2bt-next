import { useMemo } from 'react'

import { Chip } from '@mui/material'
import { umask } from 'process'

import { formatDate } from '~/helpers/date'
import type { Appointment } from '~/server-side/useCases/appointment/appointment.entity'

interface Props extends Appointment {}

export const AppointmentChip: React.FC<Props> = ({ startDate, endDate, ...rest }) => {
  const label = useMemo(() => {
    const startTime = formatDate(startDate, 'HH:mm')
    const endTime = formatDate(endDate, 'HH:mm')

    return `${startTime} - ${endTime}`
  }, [startDate, endDate])

  console.log('rest', rest)
  return <Chip label={label} component="span" />
}
