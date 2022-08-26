import { Button } from '@mui/material'
import { styled as styledMui } from '@mui/system'

export const CustomButton = styledMui(Button)(() => ({
  padding: `8px 0`,
  minWidth: 260,
  marginTop: 16
}))
