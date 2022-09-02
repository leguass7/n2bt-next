import MenuItem from '@mui/material/MenuItem'
import styled, { css } from 'styled-components'

import { alpha } from '~/helpers/colors'
import { TextProps } from '~/styles/types'

export const CellContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-content: center;
  border: 0;
  padding: 0;
`

export const Span = styled.span<TextProps>`
  font-size: ${({ textSize = 12 }) => textSize}px;
  font-weight: ${({ bold }) => (bold ? 'bold' : 'normal')};
  text-align: ${({ align = 'left' }) => align};
  text-transform: ${({ transform = 'none' }) => transform};
  color: ${({ textColor = 'inherit' }) => textColor};
  font-style: ${({ textStyle = 'normal' }) => textStyle};
  line-height: ${({ textSize = 12 }) => textSize + 2}px;
`

export const P = styled.p<{ linkColor?: string } & TextProps>`
  display: block;
  padding: 0;
  margin: 0;
  font-size: ${({ textSize = 14 }) => textSize}px;
  font-weight: ${({ bold }) => (bold ? 'bold' : 'normal')};
  text-align: ${({ align = 'left' }) => align};
  text-transform: ${({ transform = 'none' }) => transform};
  color: ${({ textColor = 'inherit' }) => textColor};
  font-style: ${({ textStyle = 'normal' }) => textStyle};
  line-height: ${({ textSize = 12 }) => textSize + 2}px;
  a {
    text-decoration: none;
    color: ${({ textColor, linkColor }) => linkColor || textColor || 'inherit'};
  }
  ${({ textColor, linkColor }) =>
    textColor || linkColor
      ? css`
          a:hover {
            color: ${alpha(linkColor || textColor, 0.7)};
          }
        `
      : css``}
`

export const CellTools = styled.div`
  padding: 0;
  margin: 0;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  align-items: center;
  align-content: center;
  gap: ${({ theme }) => theme.spacing.m}px;
`

export const MenuItemStyled = styled(MenuItem)`
  padding-right: ${({ theme }) => theme.spacing.l}px;
  .MuiSvgIcon-root {
    margin-right: ${({ theme }) => theme.spacing.xl}px;
  }
`
