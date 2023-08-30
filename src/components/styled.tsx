import Badge from '@mui/material/Badge'
import Stack from '@mui/material/Stack'
import { styled as MuiStyled } from '@mui/material/styles'
import styled, { css } from 'styled-components'

import { type FlexProps, type MarginProps, type TextProps } from '~/styles/types'

export const Text = styled.span<TextProps & { verticalPad?: number; horizontalPad?: number }>`
  font-weight: ${({ bold }) => (bold ? 'bold' : 'normal')};
  font-size: ${({ textSize = 14 }) => textSize}px;
  color: ${({ textColor = 'inherit' }) => textColor};
  text-align: ${({ align = 'inherit' }) => align};
  text-transform: ${({ transform = 'none' }) => transform};
  font-style: ${({ textStyle = 'normal' }) => textStyle};
  padding: ${({ horizontalPad = 0, verticalPad = 0 }) => `${verticalPad}px ${horizontalPad}px`};
  text-shadow: 0px 0px 1px rgba(0, 0, 0, 0.3);
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
  .MuiCard-root {
    max-width: 500px;
    width: 100%;
  }
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

export const Paragraph = styled.p<TextProps & MarginProps & { width?: string }>`
  display: block;
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
  width: ${({ width = '100%' }) => width};
  font-size: ${({ textSize = 'inherit' }) => textSize}px;
  text-align: ${({ align = 'left' }) => align};
  color: ${({ textColor = 'inherit' }) => textColor};
  font-weight: ${({ bold }) => (bold ? 'bold' : 'normal')};
  padding-top: ${({ theme, topMargin = 0, verticalSpaced }) => (verticalSpaced && !topMargin ? theme.spacing.l : topMargin)}px;
  padding-bottom: ${({ theme, bottomMargin = 0, verticalSpaced }) => (verticalSpaced ? theme.spacing.l : bottomMargin)}px;
  padding-right: ${({ horizontalSpaced, theme, rightMargin = 0 }) => (horizontalSpaced ? theme.spacing.l : rightMargin)}px;
  padding-left: ${({ horizontalSpaced, theme, leftMargin = 0 }) => (horizontalSpaced ? theme.spacing.l : leftMargin)}px;
  a {
    text-decoration: underline;
  }
`

export const MkContainer = styled.div`
  display: block;
  p {
    font-size: 16px;
    line-height: 20px;
  }
`
