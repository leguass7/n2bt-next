import { useCallback, useState } from 'react'

import { Paper } from '@mui/material'

import { useAppArena } from '~/hooks/useAppArena'

import { AppointmentListScreen } from './AppointmentListScreen'
import { AppointmentSelectScreen } from './AppointmentSelectScreen'

interface Props {
  children?: React.ReactNode
}

export const AppointmentPanel: React.FC<Props> = () => {
  const { arenaId } = useAppArena()

  const [fieldId, setFieldId] = useState(0)

  const handleSelect = useCallback((id: number) => {
    setFieldId(id)
  }, [])

  return (
    <Paper>
      {fieldId ? (
        <AppointmentListScreen onPrev={() => handleSelect(0)} fieldId={fieldId} />
      ) : (
        <AppointmentSelectScreen onSelect={handleSelect} arenaId={arenaId} />
      )}
    </Paper>
  )
}
