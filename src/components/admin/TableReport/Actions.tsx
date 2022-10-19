import { useCallback } from 'react'

import { Refresh } from '@mui/icons-material'
import { Grid, IconButton, Typography } from '@mui/material'

import { useCustomTableFilter } from '~/components/CustomTable'
import InputSearch from '~/components/CustomTable/InputSearch'

interface Props {}

export const ReportActions: React.FC<Props> = () => {
  const { updateFilter, emitFetch } = useCustomTableFilter()

  const handleSearch = useCallback(
    e => {
      const value = e.target.value

      updateFilter({ search: value })
    },
    [updateFilter]
  )

  return (
    <Grid container dir="column" flexWrap="wrap">
      <Typography variant="h6">Participantes</Typography>
      <Grid container pt={1} justifyContent="space-between">
        <InputSearch debounce={500} label="Buscar" onChange={handleSearch} />
        <IconButton onClick={emitFetch}>
          <Refresh />
        </IconButton>
      </Grid>
    </Grid>
  )
}
