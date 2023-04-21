import { useCallback } from 'react'

import { Button, Grid } from '@mui/material'

import { updatePlayField } from '~/services/api/play-field'

interface Props {
  fieldId: number
  onSuccess?: () => void
}

export const PlayFieldDelete: React.FC<Props> = ({ fieldId, onSuccess }) => {
  const handleDelete = useCallback(async () => {
    if (!fieldId) return null
    await updatePlayField(fieldId, { actived: false })

    onSuccess?.()
  }, [onSuccess, fieldId])

  return (
    <Grid container px={2} pt={2} alignItems="flex-end" justifyContent="center">
      <Button variant="outlined" color="primary" sx={{ mx: 1 }} onClick={onSuccess}>
        Não
      </Button>
      <Button variant="contained" color="error" onClick={handleDelete}>
        Sim
      </Button>
    </Grid>
  )
}
