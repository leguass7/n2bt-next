import { styled as styledMui } from '@mui/material'
import Button from '@mui/material/Button'

export const CustomButton = styledMui(Button)(() => ({
  padding: `8px 0`,
  minWidth: 260
}))
