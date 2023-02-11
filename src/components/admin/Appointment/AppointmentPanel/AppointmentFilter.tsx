import { useCallback, useState } from 'react'

import { Container, Grid, TextField } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'

interface Props {
  children?: React.ReactNode
}

export const AppointmentFilter: React.FC<Props> = () => {
  const [date, setDate] = useState(new Date())

  const handleChangeDate = useCallback((value: Date) => {
    setDate(value)
  }, [])

  return (
    <Grid container>
      <Grid item p={2}>
        <DatePicker value={date} renderInput={params => <TextField {...params} />} onChange={handleChangeDate} />
      </Grid>
    </Grid>
  )
}
