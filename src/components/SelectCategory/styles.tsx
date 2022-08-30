import { styled as styledMui } from '@mui/material'
import Button from '@mui/material/Button'
import styled from 'styled-components'

export const CustomButton = styledMui(Button)(() => ({
  padding: `8px 0`,
  minWidth: 260,
  width: '100%'
}))

export const ButtonContentFlex = styled.span`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  gap: ${({ theme }) => theme.spacing.m}px;
`
