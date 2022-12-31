import React from 'react'

import { Button, Stack } from '@mui/material'

import { usePassRoll } from '~/components/PassRollLayout'

import { ImageContainer } from './styles'

// import { Container } from './styles';

export const UploadImage: React.FC = () => {
  const { goTo } = usePassRoll('form-tournament')

  // 345x194
  const handleClickBack = () => goTo(1)
  return (
    <div>
      <ImageContainer></ImageContainer>
      <Stack direction="row" justifyContent="center" spacing={1} pt={2} pb={2}>
        <Button color="primary" variant="outlined" type="button" onClick={handleClickBack}>
          {'voltar'}
        </Button>
      </Stack>
    </div>
  )
}
