import { useCallback } from 'react'

import { Refresh } from '@mui/icons-material'
import { FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Typography } from '@mui/material'

import { useCustomTableFilter } from '~/components/CustomTable'
import InputSearch from '~/components/CustomTable/InputSearch'
import { type SubscriptionReportFilterDto } from '~/pages/api/subscription/subscription-report-filter.dto'

interface Props {}

export const ReportActions: React.FC<Props> = () => {
  const { updateFilter, emitFetch } = useCustomTableFilter<SubscriptionReportFilterDto>()

  const handleSearch = useCallback(
    e => {
      const value = e.target.value

      updateFilter({ search: value })
    },
    [updateFilter]
  )

  const handlePaidFilter = useCallback(
    e => {
      const value = e.target?.value
      const paid = value ? value === 'P' : null

      updateFilter({ paid })
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
      <Grid container pt={1} justifyContent="flex-start">
        <FormControl sx={{ width: 200 }}>
          <InputLabel>Status de pagamento</InputLabel>
          <Select onChange={handlePaidFilter}>
            <MenuItem value="">Qualquer</MenuItem>
            <MenuItem value="P">Pago</MenuItem>
            <MenuItem value="N">Não pago</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  )
}
