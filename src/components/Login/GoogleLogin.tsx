import { FaMicrosoft } from 'react-icons/fa'

import { Google } from '@mui/icons-material'
import { Button, Grid, Typography } from '@mui/material'
import { signIn } from 'next-auth/react'

interface Props {
  children?: React.ReactNode
}

export const GoogleLogin: React.FC<Props> = () => {
  return (
    <Grid container py={2} direction="column" justifyContent="center" flexWrap="wrap">
      <Typography align="center">Você também pode logar usando</Typography>
      <Button sx={{ backgroundColor: '#f1f1f1' }} variant="outlined" startIcon={<Google />} onClick={() => signIn('google')}>
        Google
      </Button>
      <Button sx={{ backgroundColor: '#f1f1f1' }} variant="outlined" startIcon={<FaMicrosoft />} onClick={() => signIn('azure-ad')}>
        Microsoft
      </Button>
    </Grid>
  )
}
