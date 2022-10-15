import { Refresh } from '@mui/icons-material'
import { Grid, IconButton, Typography } from '@mui/material'

import { useCustomTable } from '~/components/CustomTable'

interface Props {}

export const ReportActions: React.FC<Props> = () => {
  const { emitFetch } = useCustomTable()

  return (
    <Grid container justifyContent="space-between">
      <Typography variant="h6">Participantes</Typography>

      <IconButton onClick={emitFetch}>
        <Refresh />
      </IconButton>
    </Grid>
  )
}
