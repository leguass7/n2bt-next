import { useCallback, useState } from 'react'

import { Paper } from '@mui/material'

import { useAppArena } from '~/hooks/useAppArena'

import { PlayFieldWithAppointments } from '../../PlayFields/PlayFieldWithAppointments'
import { AppointmentFilter } from './AppointmentFilter'

interface Props {
  children?: React.ReactNode
}

export const AppointmentPanel: React.FC<Props> = () => {
  const { arenaId } = useAppArena()

  return (
    <Paper>
      <AppointmentFilter />
      <PlayFieldWithAppointments arenaId={arenaId} />
    </Paper>
  )
}
