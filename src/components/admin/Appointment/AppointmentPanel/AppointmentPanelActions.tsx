import { ArrowBack } from '@mui/icons-material'
import { Grid, IconButton, Typography } from '@mui/material'

interface Props {
  title?: string
  onPrev?: () => void
}

export const AppointmentsPanelActions: React.FC<Props> = ({ title, onPrev }) => {
  return (
    <Grid container p={1}>
      {onPrev ? (
        <IconButton disableRipple sx={{ ml: 1 }} onClick={onPrev}>
          <ArrowBack />
        </IconButton>
      ) : null}

      <Typography p={2} variant="h5">
        {title}
      </Typography>
    </Grid>
  )
}
