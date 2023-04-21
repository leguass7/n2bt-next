import { Add, Refresh } from '@mui/icons-material'
import ButtonGroup from '@mui/material/ButtonGroup'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

interface Props {
  onAdd?: () => void
  onReload?: () => void
}

export const PlayFieldListHeader: React.FC<Props> = ({ onAdd, onReload }) => {
  return (
    <Grid container alignItems="center" justifyContent="space-between">
      <span />
      <Typography variant="h4" align="center" py={2}>
        Campos
      </Typography>

      <ButtonGroup>
        {onAdd ? (
          <IconButton onClick={onAdd}>
            <Add />
          </IconButton>
        ) : null}

        {onReload ? (
          <IconButton onClick={onReload}>
            <Refresh />
          </IconButton>
        ) : null}
      </ButtonGroup>
    </Grid>
  )
}
