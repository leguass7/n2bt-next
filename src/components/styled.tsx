import Badge from '@mui/material/Badge'
import Stack from '@mui/material/Stack'
import { styled as MuiStyled } from '@mui/material/styles'
import styled, { css } from 'styled-components'

import { FlexProps, TextProps } from '~/styles/types'

export const Text = styled.span<TextProps & { verticalPad?: number; horizontalPad?: number }>`
  font-weight: ${({ bold }) => (bold ? 'bold' : 'normal')};
  font-size: ${({ textSize = 14 }) => textSize}px;
  color: ${({ textColor = 'inherit' }) => textColor};
  text-align: ${({ align = 'inherit' }) => align};
  text-transform: ${({ transform = 'none' }) => transform};
  font-style: ${({ textStyle = 'normal' }) => textStyle};
  padding: ${({ horizontalPad = 0, verticalPad = 0 }) => `${verticalPad}px ${horizontalPad}px`};
`

export const TextCell = styled(Text)`
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: 600;
`

export const BoxCenter = styled.div<{ spacing?: number }>`
  border: 0;
  width: 100%;
  max-width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  align-content: center;
  padding: ${({ theme, spacing = 0 }) => theme.spacing.l * spacing}px;
`

export const FlexContainer = styled.div<FlexProps & { textColor?: string; gap?: number }>`
  display: flex;
  justify-content: ${({ justify = 'space-between' }) => justify};
  align-items: center;
  align-content: center;
  width: ${({ width = '100%' }) => width};
  padding: ${({ horizontalPad = 0, verticalPad = 0 }) => `${verticalPad}px ${horizontalPad}px`};
  color: ${({ textColor = 'inherit' }) => textColor};
  gap: ${({ gap = 0 }) => gap}px;
  ${({ grow }) =>
    grow
      ? css`
          flex: ${grow};
        `
      : css``}
`

export const H4 = styled.h4<TextProps>`
  font-size: ${({ textSize }) => (textSize ? `${textSize}px` : '0.9375rem')};
  margin-bottom: 0.5rem;
  font-family: inherit;
  font-weight: 600;
  line-height: 1.5rem;
  color: ${({ textColor, theme }) => textColor || theme.colors.primary};
  text-align: ${({ align = 'left' }) => align};
  text-transform: ${({ transform = 'none' }) => transform};
`

export const H6 = styled.h6<TextProps>`
  font-size: ${({ textSize }) => (textSize ? `${textSize}px` : '1.25rem')};
  font-family: inherit;
  font-weight: bold;
  color: ${({ textColor, theme }) => textColor || theme.colors.primary};
  text-align: ${({ align = 'left' }) => align};
  text-transform: ${({ transform = 'none' }) => transform};
  display: inline-block;
  text-shadow: 0 0 1px rgba(0, 0, 0, 0.5);
`

export const HStack = styled(Stack)`
  align-items: center;
  justify-content: center;
  direction: row;
`

export const VStack = styled(Stack)`
  align-items: center;
  justify-content: center;
`

export const StyledBadge = MuiStyled(Badge, {
  shouldForwardProp: prop => prop !== 'isManager'
})<{ isManager: boolean }>(({ isManager }) => ({
  border: `2px solid ${isManager ? '#ffd700' : 'transparent'}`,
  borderRadius: '100%'
}))
